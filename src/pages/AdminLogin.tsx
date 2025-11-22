import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 60000; // 1 minute in milliseconds

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin/visitors');
      }
    });

    // Check for existing lockout
    const storedLockout = localStorage.getItem('loginLockout');
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout);
      if (lockoutTime > Date.now()) {
        setLockoutUntil(lockoutTime);
      } else {
        localStorage.removeItem('loginLockout');
        localStorage.removeItem('failedAttempts');
      }
    }

    const storedAttempts = localStorage.getItem('failedAttempts');
    if (storedAttempts) {
      setFailedAttempts(parseInt(storedAttempts));
    }
  }, [navigate]);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockoutUntil) return;

    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        setRemainingTime(0);
        localStorage.removeItem('loginLockout');
        localStorage.removeItem('failedAttempts');
        clearInterval(interval);
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Check if locked out
    if (lockoutUntil && lockoutUntil > Date.now()) {
      toast({
        title: "Too many attempts",
        description: `Please wait ${remainingTime} seconds before trying again`,
        variant: "destructive",
      });
      return;
    }

    // Validate input
    const validationResult = loginSchema.safeParse({ email, password });
    
    if (!validationResult.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0] === 'email') {
          fieldErrors.email = err.message;
        } else if (err.path[0] === 'password') {
          fieldErrors.password = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: validationResult.data.email,
        password: validationResult.data.password,
      });

      if (error) throw error;

      // Reset failed attempts on success
      setFailedAttempts(0);
      localStorage.removeItem('failedAttempts');
      localStorage.removeItem('loginLockout');

      toast({
        title: "Login successful",
        description: "Welcome to visitor analytics",
      });
      navigate('/admin/visitors');
    } catch (error: any) {
      // Increment failed attempts
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem('failedAttempts', newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION;
        setLockoutUntil(lockoutTime);
        localStorage.setItem('loginLockout', lockoutTime.toString());
        
        toast({
          title: "Account temporarily locked",
          description: "Too many failed attempts. Please wait 1 minute before trying again.",
          variant: "destructive",
        });
      } else {
        const remainingAttempts = MAX_ATTEMPTS - newAttempts;
        toast({
          title: "Login failed",
          description: `${error.message || "Invalid credentials"}. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access visitor analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (min 6 characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            {lockoutUntil && lockoutUntil > Date.now() && (
              <div className="text-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                Too many failed attempts. Please wait {remainingTime} seconds.
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || (lockoutUntil !== null && lockoutUntil > Date.now())}
            >
              {loading ? "Logging in..." : lockoutUntil && lockoutUntil > Date.now() ? `Locked (${remainingTime}s)` : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
