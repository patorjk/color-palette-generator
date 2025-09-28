import {use} from "react";
import {ThemeProviderContext} from "@/components/theme/ThemeProvider";

export const useTheme = () => {
  const context = use(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
