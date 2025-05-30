
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const CreateAdmin: React.FC = () => {
  const [email, setEmail] = useState("admin@school.com");
  const [password, setPassword] = useState("admin123");
  const [firstName, setFirstName] = useState("Admin");
  const [lastName, setLastName] = useState("User");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateAdmin = async () => {
    setIsLoading(true);

    try {
      // Sign up the admin user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin',
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          toast({
            title: "User already exists",
            description: "An account with this email already exists. Try logging in instead.",
            variant: "destructive",
          });
        } else {
          throw signUpError;
        }
      } else {
        toast({
          title: "Admin Created Successfully!",
          description: `Admin account created with email: ${email}. You can now log in.`,
        });
      }

      navigate("/login");
    } catch (error: any) {
      console.error('Admin creation error:', error);
      toast({
        title: "Error creating admin",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary rounded-full mb-4">
            <School className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Create Admin Account</h1>
          <p className="text-muted-foreground">Set up the first admin user</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Setup</CardTitle>
            <CardDescription>
              Create the administrator account for the school management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Admin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="User"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                required
              />
            </div>
            <Button
              onClick={handleCreateAdmin}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Admin..." : "Create Admin Account"}
            </Button>
            
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAdmin;
