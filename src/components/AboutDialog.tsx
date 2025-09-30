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
        <li>The app analyzes each pixel and groups similar colors into groups.</li>
        <li>It then identifies the most popular groups and picks the most dominant color from each group.
        </li>
      </ul>
      <p>
        <strong className={textClass}>Muller Colors:</strong> An experimental algorithm that adjusts colors to
        align with predetermined harmonious hue and lightness values, creating more aesthetically pleasing
        palettes. More info available here: <a href={"https://patorjk.com/blog/2010/06/24/muller-images-experiment/"} target={"_blank"}>The Müller Formula</a>.
      </p>
      <p>
        <strong className={textClass}>Use Cases:</strong> I find it useful for getting inspiration for a color palette.
        The color sets can provide a good starting place for a web app / piece of artwork / etc.
      </p>
      <p>
        <strong className={textClass}>Anecdote:</strong> Years ago, the owner of a rug website reached out about the
        algorithm behind the palette generation. He said it was the best of all the ones he'd tried and asked if he
        could use it for his website. I found this amusing since I didn't really know much about palette generation
        before building this tool, I just made it to get color palette inspiration for my own projects.
        It was validating to hear that it stood on its own, though. Hopefully its output can be of some benefit to you as well.
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
          <DialogContent className="dark:bg-dark-dialog-background md:max-w-2xl max-sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>About This App</DialogTitle>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 max-h-[500px] overflow-auto">
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
      <DrawerContent className={"dark:bg-dark-dialog-background"}>
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

