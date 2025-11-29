import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  Sun,
  Moon,
  Bell,
  Home,
  Calendar,
  MessageSquare,
  Wallet,
} from "lucide-react";

interface ClientStats {
  activeProjects: number;
  pendingBids: number;
  hiredWorkers: number;
  completedProjects: number;
}

const mockStats: ClientStats = {
  activeProjects: 3,
  pendingBids: 12,
  hiredWorkers: 5,
  completedProjects: 8,
};

const mockActiveProjects = [
  { id: "1", title: "Kitchen Renovation", status: "in_progress", workers: 2, dueDate: "Dec 15, 2025" },
  { id: "2", title: "Bathroom Remodel", status: "open", workers: 0, dueDate: "Jan 10, 2026" },
  { id: "3", title: "Solar Panel Installation", status: "in_progress", workers: 1, dueDate: "Dec 20, 2025" },
];

export default function ClientDashboard() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <DashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <Breadcrumbs items={[{ label: "Client Dashboard" }]} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    3
                  </Badge>
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 custom-scrollbar">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold font-[Poppins]">
                  Welcome, {user?.firstName || "Client"}!
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage your home improvement projects and find skilled workers.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.activeProjects}</div>
                  <p className="text-xs text-muted-foreground">Projects in progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Bids</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.pendingBids}</div>
                  <p className="text-xs text-muted-foreground">Awaiting your review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Hired Workers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.hiredWorkers}</div>
                  <p className="text-xs text-muted-foreground">Currently working</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.completedProjects}</div>
                  <p className="text-xs text-muted-foreground">Projects finished</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mb-8">
              <Link href="/post-job">
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed border-2 hover:border-primary">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">Post New Project</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Describe your project and get bids from workers
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/workers">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="font-semibold mb-1">Browse Workers</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Find skilled professionals for your needs
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/marketplace">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                      <Calendar className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="font-semibold mb-1">Rent Equipment</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Find construction equipment for your project
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Projects</CardTitle>
                    <CardDescription>Your ongoing home improvement projects</CardDescription>
                  </div>
                  <Link href="/jobs">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActiveProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{project.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {project.workers} workers
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {project.dueDate}
                          </span>
                        </div>
                      </div>
                      <Badge variant={project.status === "open" ? "secondary" : "default"}>
                        {project.status === "open" ? "Accepting Bids" : "In Progress"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
