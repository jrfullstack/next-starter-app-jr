"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, LogIn, LogOut, User2, UserRoundCog } from "lucide-react";

import { Role } from "@/app/generated/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getInitialsName } from "@/utils/get-initials-name";

export function UserNav() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const onLogout = async () => {
    await signOut({
      redirect: true, // Redirige automáticamente
      redirectTo: "/", // Redirige a la página principal
    });
  };
  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative size-8 rounded-full">
                <Avatar className="size-8">
                  <AvatarImage
                    src={session?.user.image || ""}
                    alt={`avatar de ${session?.user.name}`}
                  />
                  <AvatarFallback className="focus:text-primary hover:text-primary">
                    {isAuthenticated && session?.user.name ? (
                      getInitialsName(session?.user.name)
                    ) : (
                      <User2 size={18} />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isAuthenticated ? "Perfil" : "Iniciar sesión"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium capitalize">{session?.user.name}</p>
                <p className="text-muted-foreground text-xs leading-none">{session?.user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {session?.user.role === Role.ADMIN && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:cursor-pointer" asChild>
                    <Link href="/admin" className="flex items-center">
                      <LayoutDashboard className="text-muted-foreground mr-3 size-4" />
                      Administración
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {/* <DropdownMenuSeparator /> */}
              </>
            )}
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                <Link href={`/user/${session.user.id}`} className="flex items-center">
                  <UserRoundCog className="text-muted-foreground mr-3 size-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:cursor-pointer" onClick={onLogout}>
              <LogOut className="text-muted-foreground mr-3 size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href={"/auth/signin"} className="flex">
                <LogIn className="text-muted-foreground mr-3 size-4" />
                Iniciar sesión
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
