
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
      navigate("/dashboard");
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login functions for testing
  const handleAdminLogin = () => {
    setEmail("admin@school.com");
    setPassword("admin123");
  };

  const handleStationaryLogin = () => {
    setEmail("stationary@school.com");
    setPassword("stationary123");
  };

  const handleMedicalLogin = () => {
    setEmail("medical@school.com");
    setPassword("medical123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary rounded-full mb-4">
            <School className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">IPS Education System</h1>
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
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleAdminLogin}
                  >
                    Admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleStationaryLogin}
                  >
                    Stationary
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleMedicalLogin}
                  >
                    Medical
                  </Button>
                </div>
                <div className="text-xs text-center text-muted-foreground space-y-1">
                  <p><strong>Admin:</strong> admin@school.com / admin123</p>
                  <p><strong>Teachers:</strong> Use your registered email + any password (first login creates account)</p>
                  <p><strong>Stationary:</strong> stationary@school.com / stationary123</p>
                  <p><strong>Medical:</strong> medical@school.com / medical123</p>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Teachers: Use your registered email address. Your account will be created on first login.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
