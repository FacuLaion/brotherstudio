"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Hand, Eye, X, Loader2, Smartphone } from "lucide-react";
import { getDictionary } from "@/content/dictionary";
import { scrollByPixels } from "@/lib/scroll";
import { setHead, setHeadActive } from "@/lib/immersive";
import { OneEuroFilter } from "@/lib/oneEuro";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { GazeScroll } from "./GazeScroll";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const HAND_MODEL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const FACE_MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

type Mode = "off" | "immersive" | "gaze";
type Kind = "camera" | "gyro";
type Status = "idle" | "loading" | "ready" | "denied" | "error" | "insecure";

type LM = { x: number; y: number; z?: number };
const dist = (a: LM, b: LM) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (v: number, m = 1.3) => Math.max(-m, Math.min(m, v));

// MediaPipe logs benign INFO/WARN lines via console.error; Next's dev overlay
// shows those as errors. Route the known-noisy ones to console.debug instead.
let consolePatched = false;
function quietMediaPipeLogs() {
  if (consolePatched || typeof window === "undefined") return;
  consolePatched = true;
  const orig = console.error.bind(console);
  const noise = /^INFO:|TensorFlow Lite|XNNPACK|landmark_projection|gl_context|OpenGL error checking|^W\d{4}/;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.error = (...args: any[]) => {
    if (noise.test(String(args[0] ?? ""))) {
      console.debug(...args);
      return;
    }
    orig(...args);
  };
}

/**
 * Immersive controls (opt-in, lazy). Picks the right modality per device:
 * - Desktop: webcam Hand (pinch→navigate) + Face (head-coupled parallax).
 * - Mobile:  gyroscope tilt → the same parallax signal (no camera, low battery).
 * Plus an experimental gaze-to-scroll mode on both. Scroll / keyboard / touch
 * always work, so everything here is purely additive.
 */
export function GestureControl({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).gesture;
  const es = lang === "es";

  const [mounted, setMounted] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [mode, setMode] = useState<Mode>("off");
  const [kind, setKind] = useState<Kind>("camera");
  const [status, setStatus] = useState<Status>("idle");
  const [handDetected, setHandDetected] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [pinching, setPinching] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const camRunning = useRef(false);
  const rafRef = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faceRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const lastDetect = useRef(0);
  const pinchOn = useRef(false);
  const engageCount = useRef(0);
  const releaseCount = useRef(0);
  const lastY = useRef(0);
  const ratioEMA = useRef(1);
  const yFilter = useRef<OneEuroFilter | null>(null);
  const headEMA = useRef({ x: 0, y: 0 });
  const faceDetectedRef = useRef(false);
  const gyroBase = useRef<{ beta: number; gamma: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // ---------- gyroscope (mobile parallax) ----------
  const onOrient = useCallback((e: DeviceOrientationEvent) => {
    const beta = e.beta ?? 0; // front-back tilt
    const gamma = e.gamma ?? 0; // left-right tilt
    if (!gyroBase.current) gyroBase.current = { beta, gamma };
    const dx = clamp((gamma - gyroBase.current.gamma) / 14, 1.8);
    const dy = clamp(-(beta - gyroBase.current.beta) / 14, 1.8);
    headEMA.current.x = headEMA.current.x * 0.8 + dx * 0.2;
    headEMA.current.y = headEMA.current.y * 0.8 + dy * 0.2;
    setHead(headEMA.current.x, headEMA.current.y);
  }, []);

  const startGyro = useCallback(async () => {
    setKind("gyro");
    setMode("immersive");
    setErrMsg("");
    gyroBase.current = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DOE = window.DeviceOrientationEvent as any;
    if (DOE && typeof DOE.requestPermission === "function") {
      try {
        const res = await DOE.requestPermission();
        if (res !== "granted") {
          setStatus("denied");
          return;
        }
      } catch {
        setStatus("error");
        return;
      }
    }
    window.addEventListener("deviceorientation", onOrient);
    setHeadActive(true);
    setStatus("ready");
  }, [onOrient]);

  // ---------- webcam hand + head (desktop) ----------
  const detectFace = useCallback((video: HTMLVideoElement, now: number) => {
    const res = faceRef.current?.detectForVideo(video, now);
    const lm = res?.faceLandmarks?.[0];
    if (!lm) {
      if (faceDetectedRef.current) {
        faceDetectedRef.current = false;
        setFaceDetected(false);
      }
      return;
    }
    if (!faceDetectedRef.current) {
      faceDetectedRef.current = true;
      setFaceDetected(true);
    }
    const pts = [lm[33], lm[263], lm[1]].filter(Boolean) as LM[];
    if (!pts.length) return;
    let cx = 0;
    let cy = 0;
    for (const p of pts) {
      cx += p.x;
      cy += p.y;
    }
    cx /= pts.length;
    cy /= pts.length;
    const tx = (0.5 - cx) * 5.5;
    const ty = (0.5 - cy) * 5.5;
    headEMA.current.x = headEMA.current.x * 0.7 + tx * 0.3;
    headEMA.current.y = headEMA.current.y * 0.7 + ty * 0.3;
    setHead(clamp(headEMA.current.x, 1.6), clamp(headEMA.current.y, 1.6));
  }, []);

  const detectHand = useCallback((video: HTMLVideoElement, now: number) => {
    const res = handRef.current?.detectForVideo(video, now);
    const lm = res?.landmarks?.[0] as LM[] | undefined;
    if (!lm) {
      // Hand lost → release; reset filters so re-acquiring doesn't jump.
      setHandDetected(false);
      if (pinchOn.current) {
        pinchOn.current = false;
        setPinching(false);
      }
      engageCount.current = 0;
      releaseCount.current = 0;
      yFilter.current?.reset();
      return;
    }
    setHandDetected(true);
    const thumb = lm[4];
    const index = lm[8];
    const wrist = lm[0];
    const midMcp = lm[9];
    if (!thumb || !index || !wrist || !midMcp) return;

    // Scale-invariant pinch ratio, EMA-smoothed to stop threshold flicker.
    const rawRatio = dist(thumb, index) / (dist(wrist, midMcp) || 1e-4);
    ratioEMA.current = ratioEMA.current * 0.5 + rawRatio * 0.5;
    const ratio = ratioEMA.current;

    // One-Euro filtered fingertip Y → no jitter, still responsive on fast drags.
    const filter = (yFilter.current ??= new OneEuroFilter(1.0, 0.7));
    const y = filter.filter(index.y, now / 1000);

    if (!pinchOn.current) {
      // Engage only after a few clearly-pinched frames (kills false positives).
      engageCount.current = ratio < 0.3 ? engageCount.current + 1 : 0;
      if (engageCount.current >= 3) {
        pinchOn.current = true;
        setPinching(true);
        lastY.current = y; // anchor — no scroll on the engage frame
        releaseCount.current = 0;
      }
    } else {
      // Release after a couple of clearly-open frames → stop; page stays put.
      releaseCount.current = ratio > 0.48 ? releaseCount.current + 1 : 0;
      if (releaseCount.current >= 2) {
        pinchOn.current = false;
        setPinching(false);
        engageCount.current = 0;
        lastY.current = y;
        return;
      }
      // Drag only while fingers stay clearly together (no abrupt jump on release).
      if (ratio < 0.42) {
        let dy = y - lastY.current; // down positive
        dy = Math.max(-0.045, Math.min(0.045, dy)); // clamp → no spike from a glitch frame
        if (Math.abs(dy) > 0.0015) {
          // Drag hand UP → page scrolls DOWN (touch convention).
          scrollByPixels(-dy * window.innerHeight * 3);
        }
      }
      lastY.current = y;
    }
  }, []);

  const loop = useCallback(() => {
    if (!camRunning.current) return;
    const video = videoRef.current;
    const now = performance.now();
    if (video && video.readyState >= 2 && now - lastDetect.current > 33) {
      lastDetect.current = now;
      try {
        if (faceRef.current) detectFace(video, now);
      } catch {
        /* transient */
      }
      try {
        if (handRef.current) detectHand(video, now);
      } catch {
        /* transient */
      }
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [detectFace, detectHand]);

  const startCamera = useCallback(async () => {
    setKind("camera");
    setMode("immersive");
    setErrMsg("");
    quietMediaPipeLogs();
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setStatus("insecure");
      return;
    }
    setStatus("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("no video");
      video.srcObject = stream;
      await video.play();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vision: any = await import("@mediapipe/tasks-vision");
      const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL);
      const makeHand = (d: "GPU" | "CPU") =>
        vision.HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: HAND_MODEL, delegate: d },
          numHands: 1,
          runningMode: "VIDEO",
        });
      const makeFace = (d: "GPU" | "CPU") =>
        vision.FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: FACE_MODEL, delegate: d },
          numFaces: 1,
          runningMode: "VIDEO",
        });
      try {
        [handRef.current, faceRef.current] = await Promise.all([makeHand("GPU"), makeFace("GPU")]);
      } catch {
        [handRef.current, faceRef.current] = await Promise.all([makeHand("CPU"), makeFace("CPU")]);
      }

      camRunning.current = true;
      setHeadActive(true);
      setStatus("ready");
      rafRef.current = requestAnimationFrame(loop);
    } catch (err) {
      const e = err as { name?: string; message?: string };
      const denied = e?.name === "NotAllowedError" || e?.name === "SecurityError";
      setErrMsg(e?.name ?? e?.message ?? "error");
      setStatus(denied ? "denied" : "error");
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
      camRunning.current = false;
    }
  }, [loop]);

  // ---------- lifecycle ----------
  const stopAll = useCallback(() => {
    camRunning.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    try {
      handRef.current?.close?.();
      faceRef.current?.close?.();
    } catch {
      /* noop */
    }
    handRef.current = null;
    faceRef.current = null;
    window.removeEventListener("deviceorientation", onOrient);
    gyroBase.current = null;
    setHeadActive(false);
    setHandDetected(false);
    setFaceDetected(false);
    faceDetectedRef.current = false;
    setPinching(false);
    pinchOn.current = false;
    engageCount.current = 0;
    releaseCount.current = 0;
    ratioEMA.current = 1;
    yFilter.current?.reset();
    setStatus("idle");
    setMode("off");
  }, [onOrient]);

  const enableImmersive = useCallback(() => {
    if (coarse) startGyro();
    else startCamera();
  }, [coarse, startGyro, startCamera]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden && mode !== "off") stopAll();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [mode, stopAll]);

  useEffect(() => () => stopAll(), [stopAll]);

  if (!mounted) return null;

  if (mode === "gaze") {
    return <GazeScroll lang={lang} onClose={stopAll} />;
  }

  const cameraStatusText =
    status === "insecure"
      ? es
        ? "Abrí el sitio en http://localhost:3000 (no por IP de red) para usar la cámara."
        : "Open the site at http://localhost:3000 (not via network IP) to use the camera."
      : status === "denied"
        ? t.denied
        : status === "error"
          ? `${t.unsupported}${errMsg ? ` (${errMsg})` : ""}`
          : pinching
            ? es
              ? "Agarrando ✊ — subí o bajá"
              : "Grabbing ✊ — move up or down"
            : handDetected
              ? t.detected
              : t.showHand;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-2">
      <video ref={videoRef} muted playsInline className="hidden" aria-hidden />

      {mode === "off" && (
        <>
          <button
            type="button"
            onClick={enableImmersive}
            className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-fg transition-colors hover:border-coral/60"
          >
            {coarse ? <Smartphone size={16} className="text-coral" /> : <Hand size={16} className="text-coral" />}
            <span className="text-sm font-medium">{t.enable}</span>
            <span className="mono rounded-full bg-coral/15 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-coral">
              {t.experimental}
            </span>
          </button>
          {!coarse && (
            <button
              type="button"
              onClick={() => setMode("gaze")}
              className="glass flex items-center gap-2 rounded-full px-3 py-2 text-xs text-fg-muted transition-colors hover:text-fg"
            >
              <Eye size={14} className="text-coral" />
              {es ? "Control por mirada" : "Gaze control"}
              <span className="mono rounded-full bg-white/5 px-1.5 py-0.5 text-[0.55rem] uppercase tracking-wider text-fg-dim">
                {t.experimental}
              </span>
            </button>
          )}
        </>
      )}

      {mode === "immersive" && kind === "gyro" && (
        <div className="glass w-60 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="kicker">{t.title}</span>
            <button type="button" onClick={stopAll} aria-label={t.disable} className="text-fg-dim hover:text-fg">
              <X size={16} />
            </button>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-fg">
            <Smartphone size={16} className="text-coral" />
            {status === "denied"
              ? es
                ? "Permiso de sensores denegado."
                : "Motion permission denied."
              : es
                ? "Incliná el teléfono para mirar la escena en 3D."
                : "Tilt your phone to look around the 3D scene."}
          </p>
        </div>
      )}

      {mode === "immersive" && kind === "camera" && (
        <div className="glass w-64 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="kicker">{t.title}</span>
            <button type="button" onClick={stopAll} aria-label={t.disable} className="text-fg-dim hover:text-fg">
              <X size={16} />
            </button>
          </div>

          <div className="relative mt-3 aspect-video overflow-hidden rounded-lg border border-line bg-black">
            <VideoMirror videoRef={videoRef} />
            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-xs text-fg-muted">
                <Loader2 size={14} className="animate-spin" />
                {t.loading}
              </div>
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-full bg-black/50 px-1.5 py-0.5 text-[0.55rem] backdrop-blur">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    pinching ? "bg-coral" : handDetected ? "bg-coral/60" : "bg-fg-dim",
                  )}
                />
                ✋
              </span>
              <span className="flex items-center gap-1 rounded-full bg-black/50 px-1.5 py-0.5 text-[0.55rem] backdrop-blur">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    faceDetected ? "bg-[#5b8cff]" : "bg-fg-dim",
                  )}
                />
                🙂
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-fg-muted">{cameraStatusText}</p>
          <p className="mono mt-2 text-[0.65rem] leading-relaxed text-fg-dim">{t.hint}</p>
          <p className="mt-2 text-[0.65rem] text-fg-dim">🔒 {t.privacy}</p>
        </div>
      )}
    </div>
  );
}

/** Mirrors the live camera inside the panel using the same MediaStream. */
function VideoMirror({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  const localRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const src = videoRef.current;
    const dst = localRef.current;
    if (src && dst && src.srcObject) {
      dst.srcObject = src.srcObject;
      dst.play().catch(() => {});
    }
  });
  return (
    <video
      ref={localRef}
      muted
      playsInline
      aria-hidden
      className="h-full w-full -scale-x-100 object-cover"
    />
  );
}
