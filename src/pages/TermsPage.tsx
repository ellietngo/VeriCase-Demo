import { ArrowLeft } from 'lucide-react'
import TorchLogo from '../components/TorchLogo'
import GovBanner from '../components/GovBanner'

export default function TermsPage({ onBack }: { onBack: () => void }) {
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
        <div className="max-w-3xl mx-auto prose prose-sm prose-slate">
          <h1 className="text-3xl font-extrabold text-[#111] mb-2">Terms of Use</h1>
          <p className="text-sm text-[#999] mb-8">Last updated: June 2026</p>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#222] mb-3">1. Purpose and Scope</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              VeriCase is a guided decision-support tool built by MetaPhase to help authorized
              personnel evaluate U.S. citizenship eligibility under controlling federal statutes
              and regulations. It is designed for internal use by trained case reviewers and
              administrators in authorized workflows.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#222] mb-3">2. Not Legal Advice</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              VeriCase is an educational and operational tool — it is <strong>not</strong> legal
              advice and does not create an attorney-client relationship. Citizenship
              determinations are highly fact-specific. No output of this tool should be used as
              a final determination without review by a qualified immigration officer or attorney.
              Officers make all final determinations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#222] mb-3">3. No Data Collection</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              VeriCase does not collect, transmit, log, or store any case information, personal
              data, or interview responses. All determinations run entirely within your browser.
              Nothing leaves your device. The GeoBorder API receives only a latitude/longitude
              coordinate (if location permission is granted) and returns publicly available
              geographic data — no personal identifying information is transmitted.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#222] mb-3">4. Authorized Use Only</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              This tool is intended for use by authorized government personnel and MetaPhase
              pilot stakeholders. Unauthorized use, reverse engineering, or distribution of
              this tool or its underlying rules engine is prohibited.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#222] mb-3">5. No Government Affiliation</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              VeriCase is developed by MetaPhase and is not affiliated with, endorsed by, or
              sponsored by any U.S. federal agency, including DHS, CBP, USCIS, or EOIR.
              No federal seals or implied government endorsement should be inferred.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#222] mb-3">6. Accuracy and Currency</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              The rules engine reflects statutes, regulations, and case law as of the published
              <em> as_of_date</em> in the engine metadata. Immigration law changes frequently.
              MetaPhase makes no warranty that the engine reflects the current state of the law
              at any given time. Users should verify controlling authority before relying on any
              determination.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#222] mb-3">7. Contact</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              For questions about these terms or the VeriCase platform, contact MetaPhase at{' '}
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
