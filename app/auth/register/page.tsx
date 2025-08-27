'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth-store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register, isLoading, error, setError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!acceptTerms) {
      setError('You must accept the terms and conditions');
      return;
    }

    try {
      await register({ fullName, email, password });
      
      // Redirect to success page after successful registration
      setTimeout(() => {
        router.push('/auth/register/success');
      }, 100);
    } catch (err: any) {
      console.error('Registration error:', err);
      // Error is already handled by the auth store
    }
  };
  
  // Handler for social authentication
  const handleSocialRegister = async (provider: 'google' | 'facebook') => {
    // TODO: Implement social registration with backend API
    // For now, redirect to OAuth provider URL when backend supports it
    console.log(`Social registration with ${provider} - Not implemented yet`);
    
    // In production, this would redirect to:
    // window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}/register`;
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-600/15 to-blue-600/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md p-6">
        {/* Ultra-Modern Card */}
        <div className="group relative">
          {/* Card glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-cyan-600/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
          
          <Card className="relative bg-transparent border-0 shadow-none overflow-hidden">
            {/* Subtle Glassmorphism Effect */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl"></div>
            
            {/* Border Effect */}
            <div className="absolute inset-0 rounded-3xl border border-white/20 hover:border-white/40 transition-all duration-500"></div>
            
            <CardHeader className="relative z-10 space-y-6 pb-8">
              {/* Ultra-Modern Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl p-4">
                    <h1 className="text-3xl font-black text-white">MY</h1>
                  </div>
                </div>
              </div>
              
              {/* Modern Title */}
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200">
                  Join MythaYun
                </h2>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                  <div className="w-12 h-0.5 bg-gradient-to-l from-transparent via-purple-400 to-transparent rounded-full"></div>
                </div>
                <p className="text-white/70 font-light">
                  Create your account to start your football journey
                </p>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-xl blur-lg opacity-50"></div>
                    <Alert variant="destructive" className="relative bg-red-900/20 backdrop-blur-sm border border-red-500/30 text-red-200">
                      <AlertDescription className="text-red-200">{error}</AlertDescription>
                    </Alert>
                  </div>
                )}
                
                {/* Ultra-Modern Full Name Input */}
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="text-white/90 font-medium">Full Name</Label>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-50 transition-opacity duration-300"></div>
                    <Input 
                      id="fullName" 
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="relative bg-black/30 backdrop-blur-sm border border-white/20 focus:border-green-400/50 text-white placeholder:text-white/50 rounded-xl px-4 py-3 transition-all duration-300 focus:bg-black/40"
                    />
                  </div>
                </div>
                
                {/* Ultra-Modern Email Input */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-white/90 font-medium">Email Address</Label>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-50 transition-opacity duration-300"></div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="relative bg-black/30 backdrop-blur-sm border border-white/20 focus:border-blue-400/50 text-white placeholder:text-white/50 rounded-xl px-4 py-3 transition-all duration-300 focus:bg-black/40"
                    />
                  </div>
                </div>
                
                {/* Ultra-Modern Password Input */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-white/90 font-medium">Password</Label>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-50 transition-opacity duration-300"></div>
                    <Input 
                      id="password" 
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      className="relative bg-black/30 backdrop-blur-sm border border-white/20 focus:border-purple-400/50 text-white placeholder:text-white/50 rounded-xl px-4 py-3 transition-all duration-300 focus:bg-black/40"
                    />
                  </div>
                </div>
                
                {/* Ultra-Modern Confirm Password Input */}
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-white/90 font-medium">Confirm Password</Label>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-50 transition-opacity duration-300"></div>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                      className="relative bg-black/30 backdrop-blur-sm border border-white/20 focus:border-orange-400/50 text-white placeholder:text-white/50 rounded-xl px-4 py-3 transition-all duration-300 focus:bg-black/40"
                    />
                  </div>
                </div>
                
                {/* Ultra-Modern Terms Checkbox */}
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-start space-x-3">
                      <div className="relative mt-1">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <Checkbox 
                          id="terms" 
                          checked={acceptTerms}
                          onCheckedChange={(checked: boolean) => setAcceptTerms(checked)}
                          className="relative bg-black/30 border-white/30 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500 data-[state=checked]:border-0"
                        />
                      </div>
                      <label
                        htmlFor="terms"
                        className="text-white/80 text-sm font-medium leading-relaxed cursor-pointer"
                      >
                        I accept the{" "}
                        <Link 
                          href="/terms" 
                          className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition-colors duration-200"
                        >
                          terms and conditions
                        </Link>
                        {" "}and{" "}
                        <Link 
                          href="/privacy" 
                          className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 transition-colors duration-200"
                        >
                          privacy policy
                        </Link>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Ultra-Modern Submit Button */}
                <div className="pt-4">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-cyan-600/40 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                    <Button 
                      type="submit" 
                      className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold py-4 rounded-2xl border-0 transition-all duration-500 group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || !acceptTerms}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      
                      <div className="relative flex items-center justify-center space-x-2">
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Creating your account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-white/80 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                              <div className="w-1.5 h-1.5 bg-white/60 rounded-full group-hover:scale-125 transition-transform duration-200" style={{transitionDelay: '50ms'}}></div>
                              <div className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:scale-125 transition-transform duration-200" style={{transitionDelay: '100ms'}}></div>
                            </div>
                          </>
                        )}
                      </div>
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="relative z-10 px-8 pb-8 space-y-6">
              
              <div className="flex gap-3">
                <div className="relative group flex-1">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <Button 
                    variant="outline" 
                    className="relative w-full bg-black/30 backdrop-blur-sm border border-white/20 hover:border-red-400/60 text-white hover:bg-black/40 rounded-xl py-4 transition-all duration-300 group overflow-hidden" 
                    onClick={() => handleSocialRegister('google')} 
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    
                    <div className="relative flex items-center justify-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-red-400 group-hover:text-red-300 transition-colors">
                        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                      </svg>
                      <span className="font-semibold text-sm">Google</span>
                    </div>
                  </Button>
                </div>
                <div className="relative group flex-1">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <Button 
                    variant="outline" 
                    className="relative w-full bg-black/30 backdrop-blur-sm border border-white/20 hover:border-blue-400/60 text-white hover:bg-black/40 rounded-xl py-4 transition-all duration-300 group overflow-hidden" 
                    onClick={() => handleSocialRegister('facebook')}
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        
                    <div className="relative flex items-center justify-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-blue-400 group-hover:text-blue-300 transition-colors">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                      </svg>
                      <span className="font-semibold text-sm">Facebook</span>
                    </div>
                  </Button>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-white/70 text-sm">
                  Already have an account?{" "}
                  <Link 
                    href="/auth/login" 
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>  
              </div>

            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
