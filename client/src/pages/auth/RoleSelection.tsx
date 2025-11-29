import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { USER_ROLES } from "@/lib/skills";
import { Home, HardHat, Wrench, ArrowRight, CheckCircle } from "lucide-react";

const roleIcons = {
  client: Home,
  contractor: HardHat,
  worker: Wrench,
};

export default function RoleSelection() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const updateRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      return apiRequest("PATCH", "/api/users/profile", { role });
    },
    onSuccess: () => {
      toast({ title: "Role selected successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      if (selectedRole === "client") {
        navigate("/dashboard/client");
      } else if (selectedRole === "contractor") {
        navigate("/dashboard/contractor");
      } else if (selectedRole === "worker") {
        navigate("/dashboard/worker");
      } else {
        navigate("/dashboard");
      }
    },
    onError: () => {
      toast({ title: "Failed to set role", variant: "destructive" });
    },
  });

  const handleContinue = () => {
    if (selectedRole) {
      updateRoleMutation.mutate(selectedRole);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <Badge className="mb-4">Welcome to LabourMandi</Badge>
            <h1 className="text-3xl md:text-4xl font-bold font-[Poppins] mb-3">
              How would you like to use LabourMandi?
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select your primary role. You can always update this later in your profile settings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {USER_ROLES.map((role) => {
              const IconComponent = roleIcons[role.id as keyof typeof roleIcons];
              const isSelected = selectedRole === role.id;

              return (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected
                      ? "ring-2 ring-primary border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                  data-testid={`role-card-${role.id}`}
                >
                  <CardHeader className="text-center pb-2">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="flex items-center justify-center gap-2">
                      {role.name}
                      {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {role.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              className="gap-2 min-w-[200px]"
              disabled={!selectedRole || updateRoleMutation.isPending}
              onClick={handleContinue}
              data-testid="button-continue-role"
            >
              {updateRoleMutation.isPending ? (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <a href="/api/login" className="text-primary hover:underline">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
