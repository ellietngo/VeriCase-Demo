import { ArrowLeft, ExternalLink } from 'lucide-react'
import TorchLogo from '../components/TorchLogo'
import GovBanner from '../components/GovBanner'

type Source = { title: string; url: string; description: string }

const SOURCES: { category: string; items: Source[] }[] = [
  {
    category: 'Statutes — 8 U.S.C. (INA)',
    items: [
      { title: '8 U.S.C. § 1401 — Citizens at birth (general)', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1401', description: 'Foundational provision defining citizenship at birth in the U.S. and abroad.' },
      { title: '8 U.S.C. § 1402 — Citizens of Puerto Rico', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1402', description: 'Citizenship for persons born in Puerto Rico on or after January 13, 1941.' },
      { title: '8 U.S.C. § 1403 — Canal Zone and Republic of Panama', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1403', description: 'Birth citizenship for Panama Canal Zone births.' },
      { title: '8 U.S.C. § 1408 — Nationals but not citizens — American Samoa', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1408', description: 'American Samoa and outlying possessions produce nationals, not citizens.' },
      { title: '8 U.S.C. § 1409 — Children born out of wedlock', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1409', description: 'Transmission requirements for children born out of wedlock abroad.' },
      { title: '8 U.S.C. § 1427 — Requirements for naturalization', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1427', description: 'Standard five-year LPR continuous residence requirement.' },
      { title: '8 U.S.C. § 1431 — Child Citizenship Act (CCA)', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1431', description: 'Automatic acquisition of citizenship for children under 18 of naturalizing parents.' },
      { title: '8 U.S.C. § 1433 — Application for certificate of citizenship — N-600K', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1433', description: 'Process for children residing abroad with a U.S. citizen parent.' },
      { title: '8 U.S.C. § 1451 — Revocation of naturalization', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1451', description: 'Denaturalization proceedings and grounds for revocation.' },
      { title: '8 U.S.C. § 1481 — Loss of nationality', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1481', description: 'Expatriating acts; renunciation must be before a diplomatic or consular officer.' },
    ],
  },
  {
    category: 'Constitutional Authority',
    items: [
      { title: '14th Amendment — Citizenship Clause', url: 'https://constitution.congress.gov/constitution/amendment-14/', description: 'Birthright citizenship; "subject to the jurisdiction thereof."' },
    ],
  },
  {
    category: 'Case Law',
    items: [
      { title: 'United States v. Wong Kim Ark, 169 U.S. 649 (1898)', url: 'https://supreme.justia.com/cases/federal/us/169/649/', description: 'Birth on U.S. soil to alien parents confers 14th Amendment citizenship.' },
      { title: 'Plyler v. Doe, 457 U.S. 202 (1982)', url: 'https://supreme.justia.com/cases/federal/us/457/202/', description: 'Undocumented immigrants are "subject to the jurisdiction" and their children born here are citizens.' },
      { title: 'Nguyen v. INS, 533 U.S. 53 (2001)', url: 'https://supreme.justia.com/cases/federal/us/533/53/', description: 'Upheld differing § 1409 requirements for mothers vs. fathers of out-of-wedlock children.' },
    ],
  },
  {
    category: 'State Department — 7 FAM',
    items: [
      { title: '7 FAM 1110 — Acquisition of U.S. Citizenship', url: 'https://fam.state.gov/fam/07fam/07fam1110.html', description: 'Consular affairs guidance on citizenship at birth.' },
      { title: '7 FAM 1131.4-3 — Assisted Reproductive Technology', url: 'https://fam.state.gov/fam/07fam/07fam1131.html', description: 'Genetic connection requirement for surrogacy and ART births abroad.' },
      { title: '7 FAM 1116 — Diplomatic Immunity Exception', url: 'https://fam.state.gov/fam/07fam/07fam1116.html', description: 'VCDR Art. 31 full immunity vs. VCCR Art. 43 limited consular immunity.' },
    ],
  },
  {
    category: 'USCIS Resources',
    items: [
      { title: 'USCIS — U.S. Citizenship', url: 'https://www.uscis.gov/citizenship', description: 'Official USCIS citizenship overview and naturalization resources.' },
      { title: 'USCIS — Certificate of Citizenship (N-600)', url: 'https://www.uscis.gov/n-600', description: 'Application for certificate of citizenship for those who acquired citizenship automatically.' },
      { title: 'USCIS Policy Manual — Volume 12', url: 'https://www.uscis.gov/policy-manual/volume-12', description: 'Comprehensive USCIS guidance on citizenship and naturalization.' },
    ],
  },
  {
    category: 'GeoBorder — Geographic Data',
    items: [
      { title: 'GeoBorder API', url: 'https://geoborder.metaphase.tech', description: 'MetaPhase open-source geospatial API powering jurisdiction, CBP port, court, and ICE ERO location context in VeriCase.' },
      { title: 'U.S. Census TIGER/Line Shapefiles', url: 'https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html', description: 'Source for state, county, and congressional district boundaries.' },
      { title: 'CBP Ports of Entry', url: 'https://www.cbp.gov/contact/ports', description: 'U.S. Customs and Border Protection port locations.' },
    ],
  },
]

export default function SourcesPage({ onBack }: { onBack: () => void }) {
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
          <h1 className="text-3xl font-extrabold text-[#111] mb-2">Sources</h1>
          <p className="text-sm text-[#777] mb-8 leading-relaxed">
            Every determination in VeriCase cites controlling authority. This page lists the
            primary statutes, case law, regulatory guidance, and data sources underlying the
            rules engine and location context.
          </p>

          <div className="space-y-10">
            {SOURCES.map((group) => (
              <section key={group.category}>
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#aaa] mb-4 pb-2 border-b border-[#eee]">
                  {group.category}
                </h2>
                <ul className="space-y-4">
                  {group.items.map((src) => (
                    <li key={src.url}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-2 hover:no-underline"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#065f46] group-hover:underline leading-snug">
                            {src.title}
                            <ExternalLink size={11} className="inline ml-1 opacity-50" aria-hidden="true" />
                          </p>
                          <p className="text-xs text-[#777] mt-0.5 leading-relaxed">{src.description}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
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
