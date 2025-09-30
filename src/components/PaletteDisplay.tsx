import { StandardCard } from "@/components/StandardCard.tsx";
import { useCallback } from "react";
import { toast } from "sonner";
import { cssColorToRgba } from "color-fader";
import { type RgbaColor, rgbaToHsla } from "color-fader";
import type { ColorData } from "@/components/types.ts";

interface PaletteDisplayProps {
  palette: ColorData[];
  colorType: string;
  title: string;
  description?: string;
}

const PaletteDisplay = ({
  palette,
  colorType,
  title,
  description = "",
}: PaletteDisplayProps) => {
  const displayColor = useCallback(
    (hexString: string) => {
      if (colorType === "rgb") {
        const color: RgbaColor = cssColorToRgba(hexString);
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
      } else if (colorType === "hsl") {
        const color: RgbaColor = cssColorToRgba(hexString);
        const hslColor = rgbaToHsla(color);
        return `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`;
      } else {
        return hexString;
      }
    },
    [colorType],
  );

  const copyColor = useCallback(
    async (hexString: string) => {
      const colorValue = displayColor(hexString);
      try {
        await navigator.clipboard.writeText(colorValue);
        toast(`"${colorValue}" was copied to the clipboard!`, {
          style: {
            backgroundColor: "#4CAF50", // Example green color
            color: "white", // Example white text color for contrast
          },
        });
      } catch (err: unknown) {
        console.error("Failed to copy text: ", err);
      }
    },
    [displayColor],
  );

  return (
    <StandardCard>
      <h3
        className={`text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100`}
      >
        {title}
      </h3>
      {description && <div className={"mb-4"}>{description}</div>}
      <div className="grid grid-cols-5 max-sm:grid-cols-3 gap-4">
        {palette.map((color, idx) => (
          <div key={idx} className="text-center">
            <div
              onClick={() => copyColor(color.hex)}
              className="w-full h-20 rounded-lg shadow-md mb-2 cursor-pointer"
              style={{ backgroundColor: color.hex }}
            />
            <p
              className={`text-sm font-mono text-slate-600 dark:text-slate-400`}
            >
              {displayColor(color.hex)}
            </p>
          </div>
        ))}
      </div>
    </StandardCard>
  );
};

export default PaletteDisplay;
