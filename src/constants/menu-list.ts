import type { LucideIcon } from "lucide-react";
import { LayoutGrid, Settings, Users } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Contenido",
      menus: [
        // {
        //   href: "",
        //   label: "Posts",
        //   icon: SquarePen,
        //   submenus: [
        //     {
        //       href: "/posts",
        //       label: "All Posts",
        //     },
        //     {
        //       href: "/posts/new",
        //       label: "New Post",
        //     },
        //   ],
        // },
        // {
        //   href: "/categories",
        //   label: "Categories",
        //   icon: Bookmark,
        // },
        {
          href: "/admin/users",
          label: "Usuarios",
          icon: Users,
        },
      ],
    },
    {
      groupLabel: "Configuraciones",
      menus: [
        {
          href: "/admin/settings",
          label: "General",
          icon: Settings,
        },
        // {
        //   href: "/admin/users-settings",
        //   label: "Usuario",
        //   icon: Users,
        // },
        // {
        //   href: "/admin/seo-settings",
        //   label: "SEO",
        //   icon: Users,
        // },
        // {
        //   href: "/admin/smtp-settings",
        //   label: "SMTP",
        //   icon: Users,
        // },
      ],
    },
  ];
}
