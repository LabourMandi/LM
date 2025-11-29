import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  HardHat,
  TrendingUp,
  IndianRupee,
  Calendar,
  MapPin,
} from "lucide-react";

interface ContractorStats {
  activeProjects: number;
  teamSize: number;
  pendingBids: number;
  monthlyEarnings: string;
  completionRate: number;
}

const mockStats: ContractorStats = {
  activeProjects: 5,
  teamSize: 12,
  pendingBids: 8,
  monthlyEarnings: "2,45,000",
  completionRate: 94,
};

const mockProjects = [
  { id: "1", title: "Commercial Building - Phase 2", client: "Sharma Developers", budget: "12,50,000", progress: 65, workers: 8, location: "Mumbai" },
  { id: "2", title: "Residential Complex Wiring", client: "Green Homes Pvt Ltd", budget: "4,80,000", progress: 30, workers: 4, location: "Pune" },
  { id: "3", title: "Solar Farm Installation", client: "SunPower India", budget: "8,00,000", progress: 85, workers: 6, location: "Gujarat" },
];

const mockTeamMembers = [
  { id: "1", name: "Ramesh Kumar", skill: "Electrician", status: "working", project: "Commercial Building" },
  { id: "2", name: "Suresh Patel", skill: "Solar Installer", status: "working", project: "Solar Farm" },
  { id: "3", name: "Amit Singh", skill: "Plumber", status: "available", project: null },
  { id: "4", name: "Vikram Yadav", skill: "Mason", status: "working", project: "Residential Complex" },
];

export default function ContractorDashboard() {
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
              <Breadcrumbs items={[{ label: "Contractor Dashboard" }]} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    5
                  </Badge>
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 custom-scrollbar">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <HardHat className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold font-[Poppins]">
                  Welcome, {user?.firstName || "Contractor"}!
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage your projects, team, and grow your contracting business.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.activeProjects}</div>
                  <p className="text-xs text-muted-foreground">Ongoing work</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Team Size</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.teamSize}</div>
                  <p className="text-xs text-muted-foreground">Workers managed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Bids</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.pendingBids}</div>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{mockStats.monthlyEarnings}</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.completionRate}%</div>
                  <Progress value={mockStats.completionRate} className="mt-2 h-1" />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Active Projects</CardTitle>
                      <CardDescription>Your ongoing construction projects</CardDescription>
                    </div>
                    <Link href="/jobs">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Plus className="h-4 w-4" /> Find Jobs
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProjects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{project.title}</h4>
                            <p className="text-sm text-muted-foreground">{project.client}</p>
                          </div>
                          <Badge variant="secondary">₹{project.budget}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {project.workers} workers
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {project.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={project.progress} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{project.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>Workers under your management</CardDescription>
                    </div>
                    <Link href="/workers">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Plus className="h-4 w-4" /> Hire More
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTeamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{member.name}</h4>
                            <p className="text-xs text-muted-foreground">{member.skill}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={member.status === "available" ? "outline" : "secondary"}
                            className={member.status === "available" ? "text-green-600" : ""}
                          >
                            {member.status === "available" ? "Available" : "Working"}
                          </Badge>
                          {member.project && (
                            <p className="text-xs text-muted-foreground mt-1">{member.project}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Link href="/jobs">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-4 py-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Find New Projects</h3>
                      <p className="text-sm text-muted-foreground">Bid on available jobs</p>
                    </div>
                    <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>

              <Link href="/marketplace">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-4 py-6">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Rent Equipment</h3>
                      <p className="text-sm text-muted-foreground">Heavy machinery on demand</p>
                    </div>
                    <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>

              <Link href="/wallet">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-4 py-6">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <IndianRupee className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">View Earnings</h3>
                      <p className="text-sm text-muted-foreground">Track your payments</p>
                    </div>
                    <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
