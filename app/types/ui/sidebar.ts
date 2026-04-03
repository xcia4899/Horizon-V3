export interface SidebarOption {
  label: string;
  value: string | number;
}

export interface SidebarItem {
  title: string;
  key: string;
  options: SidebarOption[];
}