import { ArrowLeft } from 'lucide-react'
import TorchLogo from '../components/TorchLogo'
import GovBanner from '../components/GovBanner'

export default function PrivacyPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovBanner />
      <header className="border-b border-[#EEE] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-[#666] hover:text-[#333] transition-colors focus:outline-none focus:ring-2 focus:ring-green-700/20 rounded-lg px-2 py-1"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back
          </button>
          <div className="flex items-center gap-2 ml-2">
            <TorchLogo size={17} className="text-[#065f46]" />
            <span className="font-bold text-sm" style={{ color: '#065f46' }}>VeriCase</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-[#111] mb-2">Privacy Policy</h1>
          <p className="text-sm text-[#999] mb-8">Last updated: June 2026</p>

          <div className="rounded-2xl p-5 mb-8" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-sm font-semibold text-[#065f46] mb-1">The short version</p>
            <p className="text-sm text-[#166534]">
              VeriCase does not collect, store, or transmit any personal data or case information.
              Everything runs in your browser. Nothing leaves your device.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#222] mb-3">What we collect</h2>
            <p className="text-sm text-[#555] leading-relaxed mb-3">
              <strong>Nothing.</strong> VeriCase does not collect any personally identifiable
              information (PII), case data, interview responses, or session data. There are no
              accounts, no login, and no tracking.
            </p>
            <p className="text-sm text-[#555] leading-relaxed">
              If you grant location permission, your browser sends a GPS coordinate to the
              GeoBorder API, which returns publicly available geographic data (state, county,
              nearest CBP port, etc.). The coordinate is not logged or stored by MetaPhase.
              If you deny location permission, the tool continues to work without location context.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#222] mb-3">Cookies and tracking</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              VeriCase does not use cookies, analytics scripts, advertising trackers, or
              third-party SDKs that collect usage data. The only external network request made
              is the optional GeoBorder API call described above.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#222] mb-3">How the rules engine works</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              The entire citizenship determination runs in your browser using a static JSON
              decision tree. No answers are sent to any server. When you close or refresh
              the tab, all interview data is discarded.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#222] mb-3">GeoBorder API</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              GeoBorder is built by MetaPhase on top of public geographic datasets (U.S. Census
              TIGER/Line, CBP port data, EOIR court locations, ICE ERO field office locations,
              tribal trust land boundaries, and the Roosevelt Reservation). Source provenance
              and vintage travel with every API response. The API is open source and does not
              collect any user data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#222] mb-3">Questions</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              For privacy questions, contact MetaPhase at{' '}
              <a href="https://metaphase.tech" target="_blank" rel="noopener noreferrer"
                className="text-[#065f46] font-medium hover:underline">
                metaphase.tech
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#EEE] px-6 py-6">
        <div className="max-w-3xl mx-auto text-xs text-[#bbb] text-center">
          © {new Date().getFullYear()} MetaPhase. VeriCase is not affiliated with any U.S. government agency.
        </div>
      </footer>
    </div>
  )
}
