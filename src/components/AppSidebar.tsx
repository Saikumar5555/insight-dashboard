import {
  LayoutDashboard,
  GitBranch,
  Users,
  Monitor,
  Send,
  GraduationCap,
  Globe,
  UserCheck,
  Bot,
  Megaphone,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Lead Funnel", url: "/lead-funnel", icon: GitBranch },
  { title: "Lead Management", url: "/lead-management", icon: Users },
  { title: "AI Analytics", url: "/ai-analytics", icon: Monitor },
  { title: "Outreach", url: "/outreach", icon: Send },
  { title: "Course Analytics", url: "/course-analytics", icon: GraduationCap },
  { title: "Lead Sources", url: "/lead-sources", icon: Globe },
  { title: "Counselors", url: "/counselors", icon: UserCheck },
  { title: "AI SDR Performance", url: "/ai-sdr-performance", icon: Bot },
  { title: "Campaign", url: "/campaign", icon: Megaphone },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold text-foreground">AI SDR Dashboard</h2>
              <p className="text-xs text-muted-foreground">EdTech Admissions Analytics</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
