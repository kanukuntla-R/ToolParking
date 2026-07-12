import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-glow-radial animate-glow-pulse" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 text-accent text-lg font-bold mb-4 glow-green-sm animate-float">
            TP
          </div>
          <h1 className="text-xl font-semibold text-white">Tool Parking</h1>
          <p className="text-sm text-neutral-500 mt-1.5">Create your account</p>
        </div>
        <div className="flex w-full justify-center">
          <SignUp 
            appearance={{
              elements: {
                rootBox: 'mx-auto flex w-full max-w-md justify-center',
                card: 'glass mx-auto w-full max-w-md rounded-2xl p-6 glow-green-sm',
                main: 'w-full',
                footer: 'w-full',
                headerTitle: 'text-white font-semibold text-base',
                headerSubtitle: 'text-neutral-400 text-sm',
                socialButtonsBlockButton: 'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-surface-400 text-sm font-medium text-neutral-300 hover:bg-surface-300 hover:border-accent/30 hover:text-white transition-all mb-3',
                socialButtonsBlockButtonText: 'text-sm font-medium',
                dividerLine: 'bg-surface-400',
                dividerText: 'text-neutral-600 text-xs',
                formFieldLabel: 'text-neutral-400 text-xs font-medium',
                formFieldInput: 'w-full px-3 py-2.5 text-sm rounded-xl border border-surface-400 bg-surface-200 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all',
                formButtonPrimary: 'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-black text-sm font-semibold hover:bg-accent-500 disabled:opacity-50 transition-all mt-2',
                footerActionLink: 'text-accent font-medium hover:text-accent-500 transition-colors text-xs',
              },
            }}
            redirectUrl="/app/parking"
          />
        </div>
      </div>
    </div>
  )
}
