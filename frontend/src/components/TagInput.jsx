import React, { useState, useRef } from "react";

export default function TagInput({ value = [], onChange, placeholder = "Add a tag and press Enter", maxTags = 20 }) {
  const [text, setText] = useState("");
  const inputRef = useRef();

  function addTag(raw) {
    const t = String(raw || "").trim();
    if (!t) return;
    // normalize: single spacing, no leading/trailing, remove duplicates case-insensitively
    const normalized = t.replace(/\s+/g, " ");
    const exists = value.some(v => v.toLowerCase() === normalized.toLowerCase());
    if (exists) {
      setText("");
      return;
    }
    if (value.length >= maxTags) {
      setText("");
      return;
    }
    onChange?.([...value, normalized]);
    setText("");
  }

  function removeTag(idx) {
    const next = [...value];
    next.splice(idx, 1);
    onChange?.(next);
    inputRef.current?.focus();
  }

  function onKeyDown(e) {
    if (e.key === "Enter" || e.key === "," ) {
      e.preventDefault();
      addTag(text);
    } else if (e.key === "Backspace" && text === "" && value.length) {
      // remove last tag
      removeTag(value.length - 1);
    }
  }

  function onPaste(e) {
    const pasted = e.clipboardData.getData("text");
    if (!pasted) return;
    // allow comma/space/newline separated lists
    const parts = pasted.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    if (parts.length) {
      const next = [...value];
      for (const p of parts) {
        const norm = p.replace(/\s+/g, " ");
        if (!next.some(v => v.toLowerCase() === norm.toLowerCase())) next.push(norm);
        if (next.length >= maxTags) break;
      }
      onChange?.(next);
      e.preventDefault();
      setText("");
    }
  }

  return (
    <div>
      <div className="min-h-[44px] flex items-center gap-2 flex-wrap p-2 border border-border rounded-md bg-background">
        {value.map((t, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1 rounded-full bg-background-softer border border-border text-xs text-text-secondary">
            <span>{t}</span>
            <button
              aria-label={`Remove tag ${t}`}
              onClick={() => removeTag(i)}
              className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-background text-text-secondary focus:outline-none"
              title="Remove tag"
            >
              ✕
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          placeholder={placeholder}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-text-primary text-sm px-2 py-1"
          aria-label="Add tags"
        />
      </div>
      <div className="text-xs text-text-secondary mt-1">Press Enter or comma to add. Max {maxTags} tags.</div>
    </div>
  );
}
