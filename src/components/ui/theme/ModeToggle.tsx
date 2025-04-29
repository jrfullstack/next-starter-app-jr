"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger
          className="focus:text-primary hover:text-primary hover:cursor-pointer"
          asChild
        >
          <Button
            className="bg-background relative size-8 overflow-hidden rounded-full"
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="absolute size-[1.2rem] scale-0 rotate-90 opacity-0 transition-all duration-500 ease-in-out dark:scale-100 dark:rotate-0 dark:opacity-100" />
            <MoonIcon className="absolute size-[1.2rem] scale-100 rotate-0 opacity-100 transition-all duration-500 ease-in-out dark:scale-0 dark:-rotate-90 dark:opacity-0" />
            <span className="sr-only">Switch Theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Switch Theme</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
