"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown, Check, Search, X } from "lucide-react";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "zh-CN", name: "Chinese (Simp)", nativeName: "中文 (简体)", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
];

export default function LanguageTranslator({ compact = false }: { compact?: boolean }) {
  const [currentLang, setCurrentLang] = useState<string>("en");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize and check current language from cookies
  useEffect(() => {
    // Read googtrans cookie if set
    const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }

    // Load Google Translate script dynamically if not present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      // Define callback
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: "en",
              autoDisplay: false,
              includedLanguages: LANGUAGES.map((l) => l.code).join(","),
            },
            "google_translate_element"
          );
        }
      };
    }

    // Close on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to switch language
  const handleSelectLanguage = (code: string) => {
    setCurrentLang(code);
    setIsOpen(false);

    if (code === "en") {
      // Clear translation cookie
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      window.location.reload();
      return;
    }

    // Set cookie for Google translate
    document.cookie = `googtrans=/en/${code}; path=/;`;
    document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname};`;

    // Trigger select element if already rendered
    const select = document.querySelector("#google_translate_element select") as HTMLSelectElement;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
    } else {
      // Reload page to apply cookie
      window.location.reload();
    }
  };

  const currentOption = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Hidden container for Google Translate widget */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded transition-all cursor-pointer font-sans ${
          compact
            ? "py-1 px-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300"
            : "py-1 px-2.5 text-xs font-medium text-neutral-700 hover:text-[#B80000] hover:bg-neutral-100/80 border border-transparent hover:border-neutral-200"
        }`}
        title="Translate Website"
        aria-label="Translate Website"
      >
        <Globe className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
        <span className="text-sm shrink-0">{currentOption.flag}</span>
        <span className="font-semibold text-neutral-900 truncate max-w-[80px] sm:max-w-[110px]">
          {compact ? currentOption.code.toUpperCase() : currentOption.nativeName}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 sm:w-72 bg-white rounded-md shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
          {/* Header & Search */}
          <div className="px-3 pb-2 border-b border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-[#B80000]" />
                Select Language
              </span>
              {currentLang !== "en" && (
                <button
                  onClick={() => handleSelectLanguage("en")}
                  className="text-[10px] text-[#B80000] hover:underline font-semibold cursor-pointer"
                >
                  Reset (English)
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-1 text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-[#B80000] focus:bg-white"
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Popular Chips */}
          <div className="px-3 py-2 border-b border-neutral-100 flex flex-wrap gap-1 bg-neutral-50/50">
            {["en", "es", "fr", "ar", "bn", "de", "zh-CN"].map((c) => {
              const item = LANGUAGES.find((l) => l.code === c);
              if (!item) return null;
              const isSelected = currentLang === c;
              return (
                <button
                  key={c}
                  onClick={() => handleSelectLanguage(c)}
                  className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#B80000] text-white font-bold"
                      : "bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <span>{item.flag}</span>
                  <span>{item.code.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          {/* Language Options List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-neutral-50 py-1 scrollbar-thin">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400">
                No language found matching &ldquo;{search}&rdquo;
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-neutral-50 transition-colors cursor-pointer ${
                      isSelected ? "bg-red-50/50 font-semibold text-[#B80000]" : "text-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <div className="font-semibold text-neutral-900">{lang.nativeName}</div>
                        <div className="text-[10px] text-neutral-400">{lang.name}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[#B80000] stroke-[2.5]" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="px-3 pt-2 pb-1 border-t border-neutral-100 text-[10px] text-neutral-400 text-center font-mono">
            Powered by Global Neural Translation
          </div>
        </div>
      )}
    </div>
  );
}
