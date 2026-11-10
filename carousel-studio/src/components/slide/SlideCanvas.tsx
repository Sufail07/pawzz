import type { CSSProperties } from "react";
import type { Slide } from "../../../shared/schema";
import { THEMES, themeVars, type ThemeName } from "../../../shared/themes";
import { SlideIcon } from "./SlideIcon";
import { EditableText } from "./EditableText";

interface SlideCanvasProps {
  slide: Slide;
  theme: ThemeName;
  index?: number;
  total?: number;
  disclaimer?: string;
  editing?: boolean;
  onChange?: (patch: Partial<Slide>) => void;
}

function BrandMark({ theme }: { theme: ThemeName }) {
  const value = THEMES[theme];
  return (
    <div className="slide-brand">
      <span className="slide-brand-mark">
        <SlideIcon name={theme === "animal" ? "paw-print" : "sparkles"} strokeWidth={2.2} />
      </span>
      <span>
        <span className="slide-brand-name">{value.brand}</span>
        <span className="slide-brand-sub">{value.brandSub}</span>
      </span>
    </div>
  );
}

export function SlideCanvas({
  slide,
  theme,
  index = 0,
  total = 9,
  disclaimer,
  editing = false,
  onChange,
}: SlideCanvasProps) {
  const value = THEMES[theme];
  const change = (patch: Partial<Slide>) => onChange?.(patch);
  const number = String(index + 1).padStart(2, "0");
  const signLabel = theme === "animal" ? "Sign" : "Step";
  const kicker =
    slide.layout === "stat"
      ? "By the numbers"
      : slide.layout === "list"
        ? "Quick list"
        : slide.layout === "cta"
          ? "Next step"
          : `${signLabel} ${number}`;

  return (
    <div
      className={`slide slide-${slide.layout}`}
      data-theme={theme}
      data-layout={slide.layout}
      style={themeVars(theme) as CSSProperties}
    >
      <div className="slide-frame" />
      <div className="slide-content">
        <BrandMark theme={theme} />

        {slide.layout === "hook" ? (
          <div className="slide-main">
            <div className="slide-hook-body">
              <span className="slide-kicker">{theme === "animal" ? "A quick checklist" : "Start here"}</span>
              <EditableText
                value={slide.title}
                onChange={editing ? (title) => change({ title }) : undefined}
                className="slide-display slide-hook-title"
                placeholder="Hook title"
                label="Slide title"
              />
              <EditableText
                value={slide.subtitle}
                onChange={editing ? (subtitle) => change({ subtitle }) : undefined}
                className="slide-hook-subtitle"
                placeholder="Subtitle"
                label="Slide subtitle"
              />
            </div>
            <div className="slide-hook-footer">
              <span className="slide-hook-tag">
                <SlideIcon name="book-open" className="h-6 w-6" />
                {theme === "animal" ? "Save this guide" : "Save for later"}
              </span>
              <div className="slide-icon">
                <SlideIcon name={slide.icon} />
              </div>
            </div>
          </div>
        ) : null}

        {slide.layout === "statement" ? (
          <div className="slide-main">
            <div className="slide-statement-head">
              <div>
                <span className="slide-kicker">{kicker}</span>
                <EditableText
                  value={slide.title}
                  onChange={editing ? (title) => change({ title }) : undefined}
                  className="slide-display slide-statement-title"
                  placeholder="Statement title"
                  label="Slide title"
                />
              </div>
              <div className="slide-icon">
                <SlideIcon name={slide.icon} />
              </div>
            </div>
            <EditableText
              value={slide.body}
              onChange={editing ? (body) => change({ body }) : undefined}
              className="slide-body-text slide-statement-body"
              placeholder="Supporting sentence"
              label="Slide body"
              multiline
            />
            <div className="slide-statement-rule" />
          </div>
        ) : null}

        {slide.layout === "list" ? (
          <div className="slide-main">
            <span className="slide-kicker">{kicker}</span>
            <EditableText
              value={slide.title}
              onChange={editing ? (title) => change({ title }) : undefined}
              className="slide-display slide-list-title"
              placeholder="List title"
              label="List title"
            />
            <ul className="slide-list-items">
              {slide.items.map((item, itemIndex) => (
                <li className="slide-list-item" key={itemIndex}>
                  <span className="slide-list-bullet">
                    <SlideIcon name="check-circle" strokeWidth={2.4} />
                  </span>
                  <EditableText
                    value={item}
                    onChange={
                      editing
                        ? (next) => {
                            const items = [...slide.items];
                            items[itemIndex] = next;
                            change({ items });
                          }
                        : undefined
                    }
                    placeholder={`Point ${itemIndex + 1}`}
                    label={`List point ${itemIndex + 1}`}
                  />
                </li>
              ))}
            </ul>
            <div className="slide-icon" style={{ alignSelf: "flex-end" }}>
              <SlideIcon name={slide.icon} />
            </div>
          </div>
        ) : null}

        {slide.layout === "stat" ? (
          <div className="slide-main">
            <span className="slide-kicker">{kicker}</span>
            <EditableText
              value={slide.number}
              onChange={editing ? (next) => change({ number: next }) : undefined}
              className="slide-display slide-stat-number"
              placeholder="42%"
              label="Stat number"
            />
            <EditableText
              value={slide.label}
              onChange={editing ? (next) => change({ label: next }) : undefined}
              className="slide-stat-label"
              placeholder="What the number means"
              label="Stat label"
              multiline
            />
            <EditableText
              value={slide.source}
              onChange={editing ? (next) => change({ source: next }) : undefined}
              className="slide-stat-source"
              placeholder="Source line"
              label="Stat source"
              multiline
            />
            <div className="slide-icon" style={{ alignSelf: "flex-end", marginTop: "auto" }}>
              <SlideIcon name={slide.icon} />
            </div>
          </div>
        ) : null}

        {slide.layout === "quote" ? (
          <div className="slide-main">
            <span className="slide-quote-mark">“</span>
            <EditableText
              value={slide.body}
              onChange={editing ? (next) => change({ body: next }) : undefined}
              className="slide-quote-text"
              placeholder="Practical advice"
              label="Quote or tip"
              multiline
            />
            <EditableText
              value={slide.label}
              onChange={editing ? (next) => change({ label: next }) : undefined}
              className="slide-quote-label"
              placeholder="Small label"
              label="Quote label"
            />
            <div className="slide-quote-footer">
              <span className="slide-note">
                {theme === "animal" ? "When in doubt, call a professional." : "Keep it practical."}
              </span>
              <div className="slide-icon">
                <SlideIcon name={slide.icon} />
              </div>
            </div>
          </div>
        ) : null}

        {slide.layout === "cta" ? (
          <div className="slide-main">
            <span className="slide-kicker">{kicker}</span>
            <EditableText
              value={slide.title}
              onChange={editing ? (next) => change({ title: next }) : undefined}
              className="slide-display slide-cta-title"
              placeholder="Action line"
              label="CTA action line"
              multiline
            />
            <span className="slide-cta-handle">
              <SlideIcon name="arrow-right" className="h-8 w-8" strokeWidth={2.4} />
              <EditableText
                value={slide.handle}
                onChange={editing ? (next) => change({ handle: next }) : undefined}
                placeholder="@yourbrand"
                label="Handle or link"
              />
            </span>
            <p className="slide-cta-disclaimer">{disclaimer || value.disclaimer}</p>
          </div>
        ) : null}
      </div>
      <span className="slide-number">
        {number} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
