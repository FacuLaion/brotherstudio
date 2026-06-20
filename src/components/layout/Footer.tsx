import type { SectionProps } from "@/components/types";
import { siteConfig } from "@/content/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { DecryptText } from "@/components/motion/DecryptText";

export default function Footer({ lang, dict }: SectionProps) {
  const year = 2026;
  const navLinks = [
    { href: "#manifiesto", label: dict.nav.manifesto },
    { href: "#servicios", label: dict.nav.services },
    { href: "#proyectos", label: dict.nav.work },
    { href: "#productos", label: dict.nav.products },
    { href: "#contacto", label: dict.nav.contact },
  ];

  return (
    <footer className="border-t border-line bg-bg-elevated/40">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.5fr_1fr_1fr] md:px-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="display text-lg font-bold tracking-tight text-fg">Brother Studios</span>
            <span className="h-1.5 w-1.5 rounded-full bg-coral" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">{dict.footer.tagline}</p>
          <div className="mt-6 flex items-center gap-4 text-fg-dim">
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-coral">
              <InstagramIcon size={18} />
            </a>
            <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-coral">
              <LinkedinIcon size={18} />
            </a>
            <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-coral">
              <GithubIcon size={18} />
            </a>
          </div>
        </div>

        <div>
          <p className="kicker">{dict.footer.nav}</p>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="kicker">{dict.footer.language}</p>
          <div className="mt-4">
            <LanguageSwitcher lang={lang} />
          </div>
          <ul className="mt-6 space-y-2.5">
            <li>
              <a href="#" className="text-sm text-fg-muted transition-colors hover:text-fg">{dict.footer.privacy}</a>
            </li>
            <li>
              <a href="#" className="text-sm text-fg-muted transition-colors hover:text-fg">{dict.footer.terms}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="mono text-xs text-fg-dim">
            © {year} {siteConfig.name}. {dict.footer.rights}
          </p>
          <p className="mono text-xs text-fg-dim">
            <DecryptText text={dict.footer.builtWith} />
          </p>
        </div>
      </div>
    </footer>
  );
}
