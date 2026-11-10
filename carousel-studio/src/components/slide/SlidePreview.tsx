import { useLayoutEffect, useRef, useState } from "react";
import type { Slide } from "../../../shared/schema";
import type { ThemeName } from "../../../shared/themes";
import { cn } from "../../lib/cn";
import { SlideCanvas } from "./SlideCanvas";

export function SlidePreview({
  slide,
  theme,
  index,
  total,
  disclaimer,
  editing,
  onChange,
  className,
}: {
  slide: Slide;
  theme: ThemeName;
  index: number;
  total?: number;
  disclaimer?: string;
  editing?: boolean;
  onChange?: (patch: Partial<Slide>) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setScale(element.clientWidth / 1080);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden rounded-[18px] bg-studio-surface-alt", className)}
      style={{ aspectRatio: "4 / 5" }}
    >
      <div
        style={{
          width: 1080,
          height: 1350,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <SlideCanvas
          slide={slide}
          theme={theme}
          index={index}
          total={total}
          disclaimer={disclaimer}
          editing={editing}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
