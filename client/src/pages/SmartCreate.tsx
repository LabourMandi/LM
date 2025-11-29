// PATCH: smart-profile
// Created by Replit AI in SAFE MODE
// DO NOT MODIFY without human approval
// Smart Profile Creation Page

import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useTheme } from "@/contexts/ThemeContext";
import { SmartProfileForm } from "@/components/SmartProfileForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Sun, Moon } from "lucide-react";
import { useEffect } from "react";

export default function SmartCreate() {
  // Feature flag check
  const featureFlagEnabled = process.env.NEXT_PUBLIC_SMART_PROFILE_ENABLED === "true";
  
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin text-4xl">⏳</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Feature flag disabled message
  if (!featureFlagEnabled) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <DashboardSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <Breadcrumbs items={[{ label: "Smart Profile" }]} />
              </div>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </header>

            <main className="flex-1 overflow-auto">
              <div className="max-w-2xl mx-auto p-6">
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                      <div className="space-y-3">
                        <h3 className="font-semibold text-yellow-900">Smart Profile Feature Disabled</h3>
                        <p className="text-sm text-yellow-800">
                          The Smart Profile Dynamic Form is currently disabled. This is a safety feature.
                        </p>
                        <p className="text-sm text-yellow-800 font-mono bg-white p-2 rounded">
                          To enable it, set: <code>NEXT_PUBLIC_SMART_PROFILE_ENABLED=true</code>
                        </p>
                        <details className="text-sm text-yellow-800 mt-4">
                          <summary className="cursor-pointer font-medium">
                            What would be submitted (DEBUG):
                          </summary>
                          <pre className="bg-white p-2 rounded mt-2 text-xs overflow-auto max-h-96">
                            {JSON.stringify({
                              message: "Smart Profile Form Payload",
                              fields: {
                                profession: "[string]",
                                minWage: "[number]",
                                maxWage: "[number]",
                                minContractPrice: "[number]",
                                maxContractPrice: "[number]",
                                experience: "[number]",
                                specialization: "[string]",
                                availability: "[string]",
                                city: "[string]",
                                toolsOwned: "[array]",
                                bio: "[string]"
                              },
                              destination: "/api/smart/profile (POST)",
                              status: "WOULD_SUBMIT_WHEN_ENABLED"
                            }, null, 2)}
                          </pre>
                        </details>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  // Feature enabled - show the form
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
              <SidebarTrigger />
              <Breadcrumbs items={[{ label: "Create Smart Profile" }]} />
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <SmartProfileForm
              onSuccess={() => {
                navigate("/profile");
              }}
            />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// END PATCH
