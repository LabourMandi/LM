import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";
import { SKILL_CATEGORIES, ALL_SKILLS } from "@/lib/skills";
import {
  Briefcase,
  Clock,
  CheckCircle,
  ArrowRight,
  Sun,
  Moon,
  Bell,
  Wrench,
  TrendingUp,
  IndianRupee,
  Star,
  MapPin,
  Calendar,
  Send,
  Eye,
} from "lucide-react";

interface WorkerStats {
  activeBids: number;
  activeJobs: number;
  completedJobs: number;
  monthlyEarnings: string;
  rating: number;
  totalReviews: number;
}

const mockStats: WorkerStats = {
  activeBids: 4,
  activeJobs: 2,
  completedJobs: 15,
  monthlyEarnings: "45,000",
  rating: 4.8,
  totalReviews: 23,
};

const mockBids = [
  { id: "1", jobTitle: "Solar Panel Installation", client: "Green Energy Corp", bidAmount: "8,000", status: "pending", daysAgo: 2 },
  { id: "2", jobTitle: "EV Charger Installation", client: "Tesla Home", bidAmount: "5,500", status: "pending", daysAgo: 1 },
  { id: "3", jobTitle: "Electrical Wiring - Office", client: "TechPark Ltd", bidAmount: "12,000", status: "accepted", daysAgo: 5 },
  { id: "4", jobTitle: "Home Automation Setup", client: "Smart Homes India", bidAmount: "15,000", status: "rejected", daysAgo: 7 },
];

const mockJobs = [
  { id: "1", title: "Complete Electrical Rewiring", client: "Sharma Residence", payment: "25,000", progress: 60, dueDate: "Dec 20, 2025" },
  { id: "2", title: "Solar System Maintenance", client: "Industrial Park", payment: "8,000", progress: 90, dueDate: "Dec 10, 2025" },
];

const recommendedJobs = [
  { id: "1", title: "Solar Installer Needed", location: "Mumbai", budget: "10,000 - 15,000", postedAgo: "2 hours ago", skills: ["Solar Installer"] },
  { id: "2", title: "EV Charging Station Setup", location: "Pune", budget: "8,000 - 12,000", postedAgo: "5 hours ago", skills: ["EV Technician"] },
  { id: "3", title: "Industrial Electrical Work", location: "Thane", budget: "20,000 - 30,000", postedAgo: "1 day ago", skills: ["Electrical Wiring"] },
];

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  const userSkills = user?.skills || ["Electrical Wiring", "Solar Installer", "EV Technician"];

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <DashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <Breadcrumbs items={[{ label: "Worker Dashboard" }]} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    2
                  </Badge>
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 custom-scrollbar">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold font-[Poppins]">
                      Welcome, {user?.firstName || "Worker"}!
                    </h1>
                  </div>
                  <p className="text-muted-foreground">
                    Find jobs, manage your bids, and grow your career.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-bold">{mockStats.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({mockStats.totalReviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {userSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    + Add Skills
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.activeBids}</div>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.activeJobs}</div>
                  <p className="text-xs text-muted-foreground">Currently working</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.completedJobs}</div>
                  <p className="text-xs text-muted-foreground">Jobs finished</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{mockStats.monthlyEarnings}</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +8% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bids">My Bids</TabsTrigger>
                <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Bids</CardTitle>
                      <CardDescription>Your latest bid submissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockBids.slice(0, 3).map((bid) => (
                          <div
                            key={bid.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium text-sm">{bid.jobTitle}</h4>
                              <p className="text-xs text-muted-foreground">{bid.client}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">₹{bid.bidAmount}</p>
                              <Badge
                                variant={
                                  bid.status === "accepted"
                                    ? "default"
                                    : bid.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {bid.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Jobs For You</CardTitle>
                      <CardDescription>Based on your skills</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recommendedJobs.slice(0, 3).map((job) => (
                          <div
                            key={job.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          >
                            <div>
                              <h4 className="font-medium text-sm">{job.title}</h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                                <span>•</span>
                                {job.postedAgo}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm text-primary">₹{job.budget}</p>
                              <Link href={`/jobs`}>
                                <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                                  <Eye className="h-3 w-3" /> View
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="bids">
                <Card>
                  <CardHeader>
                    <CardTitle>All Bids</CardTitle>
                    <CardDescription>Track all your bid submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockBids.map((bid) => (
                        <div
                          key={bid.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{bid.jobTitle}</h4>
                            <p className="text-sm text-muted-foreground">{bid.client}</p>
                            <p className="text-xs text-muted-foreground">{bid.daysAgo} days ago</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{bid.bidAmount}</p>
                            <Badge
                              variant={
                                bid.status === "accepted"
                                  ? "default"
                                  : bid.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {bid.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jobs">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Jobs</CardTitle>
                    <CardDescription>Jobs you're currently working on</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockJobs.map((job) => (
                        <div key={job.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{job.title}</h4>
                              <p className="text-sm text-muted-foreground">{job.client}</p>
                            </div>
                            <Badge variant="secondary">₹{job.payment}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Calendar className="h-4 w-4" />
                            Due: {job.dueDate}
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={job.progress} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{job.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommended">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recommended Jobs</CardTitle>
                        <CardDescription>Based on your skills and preferences</CardDescription>
                      </div>
                      <Link href="/jobs">
                        <Button variant="outline" size="sm" className="gap-1">
                          Browse All <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendedJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                        >
                          <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                              <span>•</span>
                              <Clock className="h-4 w-4" />
                              {job.postedAgo}
                            </div>
                            <div className="flex gap-2 mt-2">
                              {job.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">₹{job.budget}</p>
                            <Link href="/jobs">
                              <Button size="sm" className="mt-2">
                                Apply Now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
