import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Library, Download, Rocket, Receipt, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo-nova-emprende.png";
import { Link } from "react-router-dom";

const items = [
  { title: "Inicio", url: "/clientes", icon: LayoutDashboard, end: true },
  { title: "Mis productos", url: "/clientes/mis-productos", icon: Library },
  { title: "Descargas", url: "/clientes/descargas", icon: Download },
  { title: "Herramientas web", url: "/clientes/herramientas", icon: Rocket },
  { title: "Compras y facturas", url: "/clientes/compras-facturas", icon: Receipt },
  { title: "Mi cuenta", url: "/clientes/cuenta", icon: User },
];

export const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Nova Emprende" className={collapsed ? "h-8" : "h-10"} />
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Área de clientes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.end
                  ? pathname === item.url
                  : pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={item.url} end={item.end} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
