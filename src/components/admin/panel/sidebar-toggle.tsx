import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib";

type SidebarToggleProps = {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
};

export function SidebarToggle({ isOpen, setIsOpen }: Readonly<SidebarToggleProps>) {
  return (
    <div className="invisible absolute top-[12px] -right-[16px] z-20 lg:visible">
      <Button
        onClick={() => setIsOpen?.()}
        className="dark:bg-input/00 dark:hover:bg-input/00 h-8 w-8 cursor-pointer rounded-md"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform duration-700 ease-in-out",
            isOpen === false ? "rotate-180" : "rotate-0",
          )}
        />
      </Button>
    </div>
  );
}
