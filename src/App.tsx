import './App.css'
import ColorPaletteGenerator from "./components/ColorPaletteGenerator.tsx";
import {ThemeProvider} from "@/components/theme/ThemeProvider.tsx";
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cpg-theme">
      <ColorPaletteGenerator/>
      <Toaster position="bottom-right" closeButton/>
    </ThemeProvider>
  )
}

export default App
