import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Info } from 'lucide-react';
import {useMediaQuery} from "@/hooks/use-media-query.ts";

interface AboutDialogProps {
  textClass: string;
  cardClass: string;
}

export function AboutDialog({textClass, cardClass}:AboutDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const content = (
    <>
      <p>
        This app analyzes images to extract their dominant colors and create harmonious color schemes.
      </p>
      <p>
        <strong className={textClass}>How it works:</strong>
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>The app analyzes each pixel and groups similar colors into "buckets".</li>
        <li>It then identifies the most "filled" buckets and picks the best color from the bucket to represent
          that bucket based on the colors inside of it.
        </li>
      </ul>
      <p>
        <strong className={textClass}>Muller Colors:</strong> An experimental algorithm that adjusts colors to
        align with predetermined harmonious hue and lightness values, creating more aesthetically pleasing
        palettes.
      </p>
      <p>
        <strong className={textClass}>Use Cases:</strong> Perfect for web designers, digital artists, and anyone
        looking to extract color schemes from photographs, artwork, or design inspiration.
      </p>
      <p>
        <strong className={textClass}>Antidote:</strong> Years ago the owner of a rug website offered me $500
        for the algorithm behind the palette generation. He said it was the best of all the ones he tried.
        Anyway, the app remains free to use, no $500 necessary. Hopefully it's output can be of some benefit to
        you.
      </p>
    </>
  );

  const button = (
    <button
      className={`inline-flex items-center gap-2 px-6 py-3 ${cardClass} rounded-lg shadow-lg hover:opacity-80 transition-opacity`}
    >
      <Info className={`w-5 h-5 ${textClass}`}/>
      <span className={textClass}>About</span>
    </button>
  )

  if (isDesktop) {
    return (
      <Dialog>
        <form>
          <DialogTrigger asChild>
            {button}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>About This App</DialogTitle>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              {content}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {button}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>About This App</DrawerTitle>
          <DrawerDescription>
          </DrawerDescription>
        </DrawerHeader>
        <div style={{overflow:'auto', padding: '1rem', display:'flex',flexDirection:'column',gap:'0.5rem'}}>
        {content}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

