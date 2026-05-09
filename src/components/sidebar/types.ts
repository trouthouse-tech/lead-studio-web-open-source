export type SidebarNavRoute = {
  name: string;
  href: string;
};

export type SidebarSection = {
  title: string;
  links: SidebarNavRoute[];
};
