'use client';
import { useAuth } from '@/hook/user-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-66.8 64.4c-26-24.4-60.6-38.5-96.1-38.5-74.3 0-134.3 60-134.3 134.3s60 134.3 134.3 134.3c82.3 0 121.5-53.7 126.4-82.6H248v-69.2h239.9c1.4 9.3 2.1 19 2.1 29.2z"></path>
    </svg>
  );

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle asChild>
            <h1 className="text-3xl font-bold text-primary font-headline">TimeWise Scheduler</h1>
          </CardTitle>
          <CardDescription>
            Schedule your meetings with ease and intelligence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <p className="text-center text-muted-foreground">
              Sign in to access your dashboard and manage your schedule.
            </p>
            <Button
              onClick={signInWithGoogle}
              className="w-full"
              size="lg"
            >
              <GoogleIcon />
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
