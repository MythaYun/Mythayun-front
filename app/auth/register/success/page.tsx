'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RegisterSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/auth/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ultra-Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Animated background overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      {/* Success Card */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            
            <CardTitle className="text-2xl font-bold text-white">
              Inscription réussie !
            </CardTitle>
            
            <CardDescription className="text-slate-300 text-center">
              Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter avec vos identifiants.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Success Message */}
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-300 text-sm">
                  🎉 Bienvenue dans MythaYun ! Votre compte est prêt à être utilisé.
                </p>
              </div>
              
              {/* Auto-redirect countdown */}
              <div className="text-slate-400 text-sm">
                Redirection automatique vers la page de connexion dans{' '}
                <span className="font-semibold text-blue-400">{countdown}</span> secondes
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoToLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Se connecter maintenant
              </Button>
              
              <Link href="/" className="block">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                >
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
