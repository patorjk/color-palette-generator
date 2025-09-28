import './App.css'
import ColorPaletteGenerator from "./components/ColorPaletteGenerator.tsx";
import {ThemeProvider} from "@/components/theme/ThemeProvider.tsx";

function App() {


  return (
    <ThemeProvider defaultTheme="system" storageKey="cpg-theme">
      <ColorPaletteGenerator/>
    </ThemeProvider>
  )
}

export default App
