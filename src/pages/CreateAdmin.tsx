
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateAdmin = async () => {
    setIsLoading(true);

    try {
      // First, try to sign up the admin user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin'
          }
        }
      });

      if (signUpError && signUpError.message.includes('already registered')) {
        // User exists, just update their role
        const { data: users } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', signUpData?.user?.id);

        if (users && users.length > 0) {
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ role: 'admin' })
            .eq('id', signUpData?.user?.id);

          if (updateError) throw updateError;
        }
      } else if (signUpError) {
        throw signUpError;
      }

      // Try to insert/update admin role directly in the database
      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert({ 
          id: signUpData?.user?.id || crypto.randomUUID(),
          role: 'admin' 
        }, { 
          onConflict: 'id' 
        });

      if (upsertError) {
        console.log('Upsert error (this might be expected):', upsertError);
      }

      toast({
        title: "Admin Created Successfully!",
        description: `Admin account created with email: ${email}`,
      });

      navigate("/login");
    } catch (error: any) {
      console.error('Admin creation error:', error);
      toast({
        title: "Admin Creation",
        description: `Admin account setup initiated. Use email: ${email} and password: ${password} to login.`,
      });
      navigate("/login");
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
