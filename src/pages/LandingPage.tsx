import { Link } from 'react-router-dom'
import { Shield, CheckCircle, Zap, Lock, ChevronDown } from 'lucide-react'

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-white"
        style={{ background: 'linear-gradient(160deg, #1a6b9a 0%, #00416A 100%)' }}
        aria-label="Hero"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50 mb-8 select-none">
          A MetaPhase Demo
        </span>

        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 border border-white/20"
          style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)' }}
          aria-hidden="true"
        >
          <Shield size={44} className="text-white" strokeWidth={1.5} />
        </div>

        <h1 className="text-6xl font-extrabold tracking-tight text-center mb-4 leading-none">
          VeriCase
        </h1>

        <p className="text-xl text-white/75 text-center max-w-xs leading-relaxed mb-12">
          Citizenship verification,<br />made simple.
        </p>

        <Link
          to="/verify"
          className="bg-white text-cbp-navy font-bold text-lg px-10 py-4 rounded-full shadow-xl
            hover:bg-white/90 active:scale-95 transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-white/50"
        >
          Begin Verification
        </Link>

        <div className="absolute bottom-8 flex flex-col items-center gap-1.5 text-white/30 select-none" aria-hidden="true">
          <span className="text-xs uppercase tracking-widest">Learn more</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-6 py-16" aria-labelledby="how-it-works-heading">
        <div className="max-w-sm mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cbp-blue text-center mb-3">
            Simple by Design
          </p>
          <h2 id="how-it-works-heading" className="text-3xl font-extrabold text-[#222222] text-center mb-12">
            How It Works
          </h2>

          <div className="space-y-10">
            <FeatureRow
              icon={<CheckCircle size={22} strokeWidth={2} className="text-cbp-blue" />}
              title="One Simple Question"
              description="We ask whether you are a U.S. citizen. That's the entire verification — no documents, no forms, no waiting."
            />
            <FeatureRow
              icon={<Zap size={22} strokeWidth={2} className="text-cbp-blue" />}
              title="Instant Result"
              description="Your status is determined immediately and displayed on screen. No processing delays."
            />
            <FeatureRow
              icon={<Lock size={22} strokeWidth={2} className="text-cbp-blue" />}
              title="Completely Private"
              description="No data is collected, stored, or transmitted. Your session leaves no trace."
            />
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/verify"
              className="inline-block bg-cbp-navy text-white font-semibold text-base px-8 py-4 rounded-full
                hover:bg-[#003558] active:scale-95 transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-cbp-navy/30"
            >
              Start Verification
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F6F6F6] border-t border-[#EEEEEE] px-6 py-12">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-3" aria-hidden="true">
            <Shield size={14} className="text-cbp-navy" strokeWidth={2} />
            <span className="font-bold text-sm text-cbp-navy tracking-tight">VeriCase</span>
          </div>

          <p className="text-xs text-[#555555] leading-relaxed mb-8">
            A demonstration product by MetaPhase. Not affiliated with or endorsed by DHS, CBP,
            USCIS, or any U.S. government agency. No data is collected or stored.
          </p>

          <p className="text-xs font-semibold uppercase tracking-widest text-[#333333] mb-4">
            More Information
          </p>
          <nav aria-label="More information links">
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.uscis.gov/citizenship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cbp-blue hover:underline focus:outline-none focus:underline"
                >
                  U.S. Citizenship Overview →
                </a>
              </li>
              <li>
                <a
                  href="https://www.uscis.gov/n-560"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cbp-blue hover:underline focus:outline-none focus:underline"
                >
                  Certificate of Citizenship →
                </a>
              </li>
              <li>
                <span className="text-sm text-[#AAAAAA]">
                  Verification History — coming soon
                </span>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function FeatureRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-cbp-tint flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-[#222222] mb-1">{title}</h3>
        <p className="text-sm text-[#555555] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
