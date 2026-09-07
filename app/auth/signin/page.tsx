'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/booking';
  const { signIn, signUp, signInWithGoogle, sendMagicLink } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'magic'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email || !password) {
      setErrorMsg('Please provide email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      setSuccessMsg('Authentication successful! Redirecting...');
      setTimeout(() => {
        router.push(callbackUrl);
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!fullName || !email || !phone || !password) {
      setErrorMsg('Please complete all required fields (*).');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setIsSubmitting(true);
    try {
      await signUp(email, password, fullName, phone);
      setSuccessMsg('Customer profile registered successfully! Redirecting...');
      setTimeout(() => {
        router.push(callbackUrl);
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      setSuccessMsg('Google sign-in complete! Redirecting...');
      setTimeout(() => {
        router.push(callbackUrl);
      }, 600);
    } catch (err: any) {
      setErrorMsg('Google authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      await sendMagicLink(email);
      setSuccessMsg('Magic link sent! Redirecting to reservation...');
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1000);
    } catch (err) {
      setErrorMsg('Error dispatching magic link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full bg-[#0B1914] text-[#F4F1EA] rounded-3xl border border-white/10 p-8 shadow-2xl relative my-12 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />

      {/* Header */}
      <div className="text-center mb-6 pt-2">
        <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#d4af37] uppercase mb-2 bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
          <span>🛡️</span>
          <span>SANCTUARY GATEWAY</span>
        </div>
        <h1 className="font-serif text-3xl font-light tracking-wide text-white mb-2">
          Secure Your Reservation
        </h1>
        <p className="text-xs text-stone-300 font-light leading-relaxed">
          Sign in or create an account to secure your expedition reservation
        </p>
      </div>

      {/* Tab Controls */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/[0.04] rounded-xl border border-white/10 mb-6">
        <button
          type="button"
          onClick={() => { setActiveTab('signin'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'signin'
              ? 'bg-[#d4af37] text-[#0B1914] shadow-md'
              : 'text-stone-300 hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'signup'
              ? 'bg-[#d4af37] text-[#0B1914] shadow-md'
              : 'text-stone-300 hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-500/40 text-red-200 text-xs rounded-xl flex items-start gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-900/40 border border-emerald-500/40 text-emerald-200 text-xs rounded-xl flex items-start gap-2">
          <span>✨</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={isSubmitting}
        className="w-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 hover:border-[#d4af37]/60 py-2.5 px-4 rounded-xl text-xs font-medium tracking-wide transition-all cursor-pointer flex items-center justify-center gap-3 mb-5 disabled:opacity-50"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
        </svg>
        <span>Continue with Google</span>
      </button>

      <div className="relative flex py-2 items-center mb-5">
        <div className="flex-grow border-t border-white/10" />
        <span className="flex-shrink mx-3 text-[10px] uppercase font-mono tracking-widest text-stone-400">
          or use email
        </span>
        <div className="flex-grow border-t border-white/10" />
      </div>

      {activeTab === 'signin' && (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-stone-300 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kayaker@example.com"
              className="w-full bg-white/[0.04] border border-white/15 focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-stone-300 uppercase tracking-wider mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/[0.04] border border-white/15 focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#d4af37] hover:bg-[#c59e2b] text-[#0B1914] font-semibold py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In & Continue'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('magic')}
              className="text-[11px] text-[#d4af37] hover:underline cursor-pointer"
            >
              Sign in with Passwordless Magic Link →
            </button>
          </div>
        </form>
      )}

      {activeTab === 'signup' && (
        <form onSubmit={handleSignUp} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-mono text-stone-300 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Kasun Perera"
              className="w-full bg-white/[0.04] border border-white/15 focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-stone-300 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kasun@example.com"
              className="w-full bg-white/[0.04] border border-white/15 focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-stone-300 uppercase tracking-wider mb-1">
              WhatsApp Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+94 77 123 4567"
              className="w-full bg-white/[0.04] border border-white/15 focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-stone-300 uppercase tracking-wider mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-white/[0.04] border border-white/15 focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#d4af37] hover:bg-[#c59e2b] text-[#0B1914] font-semibold py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account & Continue'}
          </button>
        </form>
      )}

      {activeTab === 'magic' && (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <p className="text-xs text-stone-300 font-light leading-relaxed">
            Enter your email to receive an instant magic link to secure your reservation.
          </p>
          <div>
            <label className="block text-[11px] font-mono text-stone-300 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="explorer@example.com"
              className="w-full bg-white/[0.04] border border-white/15 focus:border-[#d4af37] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#d4af37] hover:bg-[#c59e2b] text-[#0B1914] font-semibold py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Sending Link...' : 'Send Magic Link'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className="text-[11px] text-stone-400 hover:text-white cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center text-[10px] text-stone-400 font-mono tracking-wider">
        <Link href="/booking" className="hover:text-[#d4af37] transition-colors">
          Return to Booking Page Without Signing In →
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#07110E] text-stone-100 font-sans flex flex-col justify-between overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full pt-28 pb-16 px-4 flex items-center justify-center">
        <Suspense fallback={<div className="text-xs text-stone-400">Loading auth gateway...</div>}>
          <SignInContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
