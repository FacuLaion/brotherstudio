"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { getDictionary } from "@/content/dictionary";
import { scrollByPixels } from "@/lib/scroll";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const FACE_MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

type Phase = "loading" | "denied" | "error" | "insecure" | "calTop" | "calBottom" | "running";
type LM = { x: number; y: number; z?: number };

const CAL_MS = 1600; // calibration dwell per target
const SPEED = 26; // px per frame at full deflection
const DEAD = 0.14; // central dead zone (no scroll)

/**
 * EXPERIMENTAL gaze-to-scroll. Calibrates "look up" and "look down", then maps
 * vertical eye position to a scroll velocity with a central dead zone to avoid
 * the Midas-touch problem. Accuracy is approximate — especially on mobile.
 */
export function GazeScroll({ lang, onClose }: { lang: Locale; onClose: () => void }) {
  const t = getDictionary(lang).gesture;
  const es = lang === "es";

  const [phase, setPhase] = useState<Phase>("loading");
  const [dir, setDir] = useState<-1 | 0 | 1>(0);
  const [errMsg, setErrMsg] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faceRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(true);

  const phaseRef = useRef<Phase>("loading");
  const calStart = useRef(0);
  const calSamples = useRef<number[]>([]);
  const topRatio = useRef(0.35);
  const bottomRatio = useRef(0.65);
  const frameCount = useRef(0);
  const gazeEMA = useRef<number | null>(null);

  const setPhaseBoth = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const ratioOf = (lm: LM[]): number | null => {
    const calc = (up: number, low: number, iris: number) => {
      const u = lm[up];
      const l = lm[low];
      const i = lm[iris];
      if (!u || !l || !i) return null;
      const d = l.y - u.y || 1e-4;
      return (i.y - u.y) / d;
    };
    const r = calc(159, 145, 468); // right eye
    const l = calc(386, 374, 473); // left eye
    const vals = [r, l].filter((v): v is number => v != null);
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const stop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    try {
      faceRef.current?.close?.();
    } catch {
      /* noop */
    }
    faceRef.current = null;
  }, []);

  const loop = useCallback(() => {
    if (!runningRef.current) return;
    const video = videoRef.current;
    const now = performance.now();
    if (video && video.readyState >= 2 && faceRef.current) {
      try {
        const res = faceRef.current.detectForVideo(video, now);
        const lm = res?.faceLandmarks?.[0] as LM[] | undefined;
        const ratio = lm ? ratioOf(lm) : null;
        const p = phaseRef.current;

        if (ratio != null && (p === "calTop" || p === "calBottom")) {
          if (calStart.current === 0) calStart.current = now;
          calSamples.current.push(ratio);
          if (now - calStart.current > CAL_MS) {
            const avg =
              calSamples.current.reduce((a, b) => a + b, 0) / (calSamples.current.length || 1);
            if (p === "calTop") {
              topRatio.current = avg;
              calSamples.current = [];
              calStart.current = 0;
              setPhaseBoth("calBottom");
            } else {
              bottomRatio.current = avg;
              calSamples.current = [];
              calStart.current = 0;
              setPhaseBoth("running");
            }
          }
        } else if (ratio != null && p === "running") {
          gazeEMA.current =
            gazeEMA.current == null ? ratio : gazeEMA.current * 0.65 + ratio * 0.35;
          const span = bottomRatio.current - topRatio.current || 1e-3;
          let tn = (gazeEMA.current - topRatio.current) / span;
          tn = Math.max(0, Math.min(1, tn));
          let v = 0;
          if (tn < 0.5 - DEAD) v = -((0.5 - DEAD - tn) / (0.5 - DEAD));
          else if (tn > 0.5 + DEAD) v = (tn - (0.5 + DEAD)) / (0.5 - DEAD);
          if (v !== 0) scrollByPixels(v * SPEED);
          frameCount.current++;
          if (frameCount.current % 5 === 0) {
            setDir(v < -0.05 ? -1 : v > 0.05 ? 1 : 0);
          }
        }
      } catch {
        /* transient */
      }
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [setPhaseBoth]);

  useEffect(() => {
    let cancelled = false;
    runningRef.current = true;

    (async () => {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setPhaseBoth("insecure");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
        });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) throw new Error("no video");
        video.srcObject = stream;
        await video.play();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const vision: any = await import("@mediapipe/tasks-vision");
        const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL);
        const make = (d: "GPU" | "CPU") =>
          vision.FaceLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: FACE_MODEL, delegate: d },
            numFaces: 1,
            runningMode: "VIDEO",
          });
        try {
          faceRef.current = await make("GPU");
        } catch {
          faceRef.current = await make("CPU");
        }
        if (cancelled) return;
        setPhaseBoth("calTop");
        rafRef.current = requestAnimationFrame(loop);
      } catch (err) {
        const e = err as { name?: string };
        setErrMsg(e?.name ?? "error");
        setPhaseBoth(
          e?.name === "NotAllowedError" || e?.name === "SecurityError" ? "denied" : "error",
        );
      }
    })();

    return () => {
      cancelled = true;
      stop();
    };
  }, [loop, stop, setPhaseBoth]);

  const close = () => {
    stop();
    onClose();
  };

  const calibrating = phase === "calTop" || phase === "calBottom";

  return (
    <div className="pointer-events-none fixed inset-0 z-[120]">
      <video ref={videoRef} muted playsInline className="hidden" aria-hidden />

      {/* Calibration overlay */}
      {calibrating && (
        <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm">
          <div
            className={cn(
              "absolute left-1/2 h-8 w-8 -translate-x-1/2 rounded-full border-2 border-coral",
              phase === "calTop" ? "top-12 animate-ping" : "bottom-12 animate-ping",
            )}
          />
          <div
            className={cn(
              "absolute left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-coral",
              phase === "calTop" ? "top-12" : "bottom-12",
            )}
          />
          <div className="absolute left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="kicker justify-center">{es ? "Calibración" : "Calibration"}</p>
            <p className="display mt-3 text-2xl text-fg">
              {phase === "calTop"
                ? es
                  ? "Mirá el punto de arriba"
                  : "Look at the top dot"
                : es
                  ? "Mirá el punto de abajo"
                  : "Look at the bottom dot"}
            </p>
            <p className="mt-2 text-sm text-fg-muted">
              {es ? "Mantené la mirada un segundo…" : "Hold your gaze for a second…"}
            </p>
          </div>
        </div>
      )}

      {/* Persistent gaze targets while running — look AT a dot to scroll */}
      {phase === "running" && (
        <>
          <div
            className={cn(
              "pointer-events-none absolute left-1/2 top-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-2 border-coral transition-all duration-200",
              dir === -1 ? "scale-125 bg-coral shadow-glow" : "bg-coral/20",
            )}
          >
            <ArrowUp size={18} className={dir === -1 ? "text-bg" : "text-coral"} />
          </div>
          <div
            className={cn(
              "pointer-events-none absolute bottom-10 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-2 border-coral transition-all duration-200",
              dir === 1 ? "scale-125 bg-coral shadow-glow" : "bg-coral/20",
            )}
          >
            <ArrowDown size={18} className={dir === 1 ? "text-bg" : "text-coral"} />
          </div>
        </>
      )}

      {/* Status / control panel */}
      <div className="glass pointer-events-auto absolute bottom-5 left-5 w-64 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="kicker">{es ? "Mirada (beta)" : "Gaze (beta)"}</span>
          <button type="button" onClick={close} aria-label={t.disable} className="text-fg-dim hover:text-fg">
            <X size={16} />
          </button>
        </div>

        {phase === "loading" && (
          <p className="mt-3 flex items-center gap-2 text-xs text-fg-muted">
            <Loader2 size={14} className="animate-spin" />
            {t.loading}
          </p>
        )}
        {(phase === "denied" || phase === "error" || phase === "insecure") && (
          <p className="mt-3 text-xs text-fg-muted">
            {phase === "insecure"
              ? es
                ? "Abrí el sitio en http://localhost:3000 para usar la cámara."
                : "Open the site at http://localhost:3000 to use the camera."
              : phase === "denied"
                ? t.denied
                : `${t.unsupported}${errMsg ? ` (${errMsg})` : ""}`}
          </p>
        )}
        {phase === "running" && (
          <>
            <div className="mt-3 flex items-center justify-center gap-3">
              <ArrowUp size={18} className={cn(dir === -1 ? "text-coral" : "text-fg-dim")} />
              <span className="mono text-xs text-fg-muted">
                {es ? "mirá arriba/abajo" : "look up/down"}
              </span>
              <ArrowDown size={18} className={cn(dir === 1 ? "text-coral" : "text-fg-dim")} />
            </div>
            <p className="mt-3 text-[0.65rem] text-fg-dim">
              {es
                ? "Mirá el punto rojo de arriba para subir y el de abajo para bajar. El centro no scrollea."
                : "Look at the top red dot to scroll up, the bottom one to go down. The center doesn't scroll."}
            </p>
          </>
        )}
        <p className="mt-2 text-[0.65rem] text-fg-dim">🔒 {t.privacy}</p>
      </div>
    </div>
  );
}
