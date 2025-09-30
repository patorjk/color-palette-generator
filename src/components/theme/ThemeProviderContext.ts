import {createContext} from "react";

export type Theme = "dark" | "light" | "system"

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
)
