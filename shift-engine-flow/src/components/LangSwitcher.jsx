import { useI18n } from "../lib/i18n";

const LANGUAGES = [
  { code: "cs", label: "CZ" },
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
  { code: "pl", label: "PL" },
  { code: "sk", label: "SK" },
];

export default function LangSwitcher({ className = "" }) {
  const { lang, setLang } = useI18n();

  return (
    <div className={`relative ${className}`}>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className={`font-semibold rounded px-1.5 py-1 pr-5 cursor-pointer appearance-none transition-colors focus:outline-none ${
          className.includes('sidebar') 
            ? 'text-[10px] bg-sidebar-accent border border-sidebar-primary/40 text-sidebar-foreground hover:bg-sidebar-accent/80 hover:border-sidebar-primary/60 focus:border-sidebar-primary'
            : 'text-xs bg-transparent border border-border text-foreground hover:border-primary/50 focus:border-primary'
        }`}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">▾</span>
    </div>
  );
}