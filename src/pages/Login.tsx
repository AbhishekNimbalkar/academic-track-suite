
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { School } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      // Navigation is handled in the login function
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  // Quick admin login for testing
  const handleAdminLogin = () => {
    setEmail("admin@school.com");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary rounded-full mb-4">
            <School className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">School Management System</h1>
          <p className="text-muted-foreground">Login to access your dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@school.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              
              <div className="flex flex-col space-y-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleAdminLogin}
                >
                  Fill Admin Credentials
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Admin: admin@school.com / admin123
                </p>
              </div>

              <p className="text-sm text-center text-muted-foreground">
                Need an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
                {" | "}
                <Link to="/create-admin" className="text-primary hover:underline">
                  Create Admin
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Contact your administrator for login credentials or create an admin account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
