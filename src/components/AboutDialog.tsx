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
import { Info } from 'lucide-react';

interface AboutDialogProps {
  textClass: string;
  cardClass: string;
}

export function AboutDialog({textClass, cardClass}:AboutDialogProps) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button
            className={`inline-flex items-center gap-2 px-6 py-3 ${cardClass} rounded-lg shadow-lg hover:opacity-80 transition-opacity`}
          >
            <Info className={`w-5 h-5 ${textClass}`} />
            <span className={textClass}>About</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            boop
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

