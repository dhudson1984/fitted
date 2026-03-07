"use client";

import { useState } from "react";
import { BRAND_SUGGESTIONS } from "@/lib/survey-data";

interface StepBrandsProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function StepBrands({ selected, onChange }: StepBrandsProps) {
  const [search, setSearch] = useState("");

  function addBrand(brand: string) {
    if (!selected.includes(brand)) {
      onChange([...selected, brand]);
    }
    setSearch("");
  }

  function removeBrand(brand: string) {
    onChange(selected.filter((b) => b !== brand));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && search.trim()) {
      e.preventDefault();
      addBrand(search.trim());
    }
  }

  const filteredSuggestions = BRAND_SUGGESTIONS.filter(
    (b) =>
      !selected.includes(b) &&
      b.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-xl space-y-6" data-testid="step-brands" style={{ animation: "fadeUp 0.4s ease both" }}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search or type a brand name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          data-testid="input-brand-search"
          className="w-full px-4 py-3 rounded-md border border-sand bg-transparent text-charcoal text-[15px] focus:outline-none focus:border-charcoal transition-colors"
          style={{ borderWidth: "1.5px" }}
        />
        {search && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-warm-white border border-sand rounded-md shadow-sm z-10 max-h-48 overflow-y-auto">
            {filteredSuggestions.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => addBrand(brand)}
                data-testid={`suggestion-${brand.toLowerCase().replace(/\s+/g, "-")}`}
                className="w-full text-left px-4 py-2.5 text-[14px] text-charcoal hover:bg-sand/40 transition-colors"
              >
                {brand}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex gap-2 flex-wrap" data-testid="selected-brands">
          {selected.map((brand) => (
            <span
              key={brand}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-charcoal text-cream text-[13px] font-medium"
            >
              {brand}
              <button
                type="button"
                onClick={() => removeBrand(brand)}
                data-testid={`remove-brand-${brand.toLowerCase().replace(/\s+/g, "-")}`}
                className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <div>
        <p className="text-[13px] text-muted mb-3">Suggestions</p>
        <div className="flex gap-2 flex-wrap">
          {BRAND_SUGGESTIONS.filter((b) => !selected.includes(b)).map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => addBrand(brand)}
              data-testid={`chip-${brand.toLowerCase().replace(/\s+/g, "-")}`}
              className="px-4 py-2 rounded-md border border-sand text-[13px] text-charcoal font-medium hover:bg-sand/40 hover:border-stone transition-all duration-200"
              style={{ borderWidth: "1.5px" }}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
