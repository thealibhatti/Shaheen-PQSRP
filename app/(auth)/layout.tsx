import { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side — ShaheenShield Branding (Premium Dark Slate) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(135deg, #0b0f17 0%, #0f172a 40%, #0b0f17 100%)',
        }}
      >
        {/* Animated red glow accent top-right */}
        <div
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)',
            animation: 'redGlow 4s ease-in-out infinite',
          }}
        />
        {/* Animated blue glow bottom-left */}
        <div
          className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)',
            animation: 'redGlow 6s ease-in-out infinite 2s',
          }}
        />
        {/* Subtle dot grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.03) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Decorative border line on right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-500/30 to-transparent" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="ShaheenShield Logo"
              width={44}
              height={44}
              className="rounded-xl shrink-0"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(239, 68, 68, 0.3))' }}
            />
            <div>
              <div className="text-lg font-black tracking-wide text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                SHAHEEN<span className="text-red-500">SHIELD</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
                Post-Quantum Readiness
              </div>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <div className="inline-block px-3 py-1.5 border border-white/10 bg-white/[0.03] rounded-full text-[11px] font-bold tracking-[0.15em] text-slate-400 uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>
            NATIONAL INITIATIVE
          </div>
          <h1 className="text-5xl font-black text-white leading-[1.05]" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}>
            Post-Quantum<br />
            <span className="text-red-500">Security</span>
            <br />Assessment
          </h1>
          <div className="w-16 h-[3px] bg-red-500 rounded-full" />
          <p className="text-slate-400 text-[15px] max-w-sm leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Identify quantum-vulnerable cryptography in your infrastructure before
            it&apos;s too late. Protect your data against{' '}
            <span className="text-red-400 font-semibold">&quot;Harvest Now, Decrypt Later&quot;</span> attacks.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="text-center p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
              <div className="text-2xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>100+</div>
              <div className="text-slate-500 text-[11px] mt-1 font-medium">Endpoints Scanned</div>
            </div>
            <div className="text-center p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
              <div className="text-2xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>15+</div>
              <div className="text-slate-500 text-[11px] mt-1 font-medium">Crypto Algorithms</div>
            </div>
            <div className="text-center p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
              <div className="text-2xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>PDF</div>
              <div className="text-slate-500 text-[11px] mt-1 font-medium">Reports Generated</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-slate-600 text-xs font-medium">
          © {new Date().getFullYear()} ShaheenShield. All rights reserved.
        </div>
      </div>

      {/* Right side — Auth form (dark matching) */}
      <div className="flex-1 flex items-center justify-center p-8"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background)) 100%)',
        }}
      >
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}