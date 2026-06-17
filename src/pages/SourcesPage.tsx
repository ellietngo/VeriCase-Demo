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
    category: 'Statutes — Immigration Status (8 U.S.C. / INA)',
    items: [
      { title: '8 U.S.C. § 1101(a)(15) — Nonimmigrant classifications', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1101', description: 'Defines the nonimmigrant visa categories — students (F, M), temporary workers (H, L, O, P, E, R), visitors (B), exchange visitors (J), fiancé(e)s (K), and crime/trafficking victims (U, T).' },
      { title: '8 U.S.C. § 1101(a)(20) — Lawful permanent resident defined', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1101', description: 'Defines "lawfully admitted for permanent residence" — the basis for LPR (green card) status.' },
      { title: '8 U.S.C. § 1101(a)(22) — National, but not citizen', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1101', description: 'Defines "national of the United States," a status distinct from citizenship.' },
      { title: '8 U.S.C. § 1101(a)(27) — Special immigrant defined', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1101', description: 'Defines special immigrant categories, including Special Immigrant Juveniles (SIJ) and religious workers.' },
      { title: '8 U.S.C. § 1154(a)(1)(A)(iii) — VAWA self-petitions', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1154', description: 'Self-petitioning process for victims of abuse by a U.S. citizen or LPR spouse or parent.' },
      { title: '8 U.S.C. § 1157 — Refugee admissions', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1157', description: 'Annual refugee admissions ceiling and admission procedures.' },
      { title: '8 U.S.C. § 1158 — Asylum', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1158', description: 'Eligibility and procedure for a grant of asylum, including pending asylum applications.' },
      { title: '8 U.S.C. § 1182(d)(5) — Parole authority', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1182', description: 'DHS authority to parole an applicant for admission for urgent humanitarian reasons or significant public benefit.' },
      { title: '8 U.S.C. § 1184(o) — T nonimmigrant status procedures', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1184', description: 'Procedures and numerical limits for T nonimmigrant (trafficking victim) status.' },
      { title: '8 U.S.C. § 1184(p) — U nonimmigrant status procedures', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1184', description: 'Procedures and numerical limits for U nonimmigrant (crime victim) status.' },
      { title: '8 U.S.C. § 1186a — Conditional permanent resident status', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1186a', description: 'Two-year conditional residence for marriage-based green card holders; basis for Form I-751/I-829.' },
      { title: '8 U.S.C. § 1227 — Deportable aliens', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1227', description: 'Grounds of removability for individuals who entered lawfully but fell out of status.' },
      { title: '8 U.S.C. § 1229b — Cancellation of removal', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1229b', description: 'Discretionary relief from removal available in immigration court proceedings.' },
      { title: '8 U.S.C. § 1254a — Temporary Protected Status', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1254a', description: 'TPS country designation, eligibility, and Form I-821 filing basis.' },
      { title: '8 U.S.C. § 1255 — Adjustment of status', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1255', description: 'Adjustment to lawful permanent resident status from within the U.S. via Form I-485.' },
      { title: '8 U.S.C. § 1258 — Change of nonimmigrant classification', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1258', description: 'Procedure for changing or extending a nonimmigrant classification.' },
    ],
  },
  {
    category: 'Federal Regulations — Immigration Status (8 C.F.R.)',
    items: [
      { title: '8 C.F.R. § 103.2 — Applications, petitions, and evidence', url: 'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-A/part-103/section-103.2', description: 'General filing and evidentiary requirements; basis for cases needing further document or record review.' },
      { title: '8 C.F.R. § 214.1 — Nonimmigrant general requirements', url: 'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.1', description: 'General nonimmigrant admission, extension, and maintenance-of-status requirements.' },
      { title: '8 C.F.R. § 274a.12(c)(14) — Deferred action work authorization', url: 'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-274a/section-274a.12', description: 'Employment authorization eligibility for individuals granted deferred action, including DACA.' },
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
      { title: 'USCIS — Consideration of DACA', url: 'https://www.uscis.gov/humanitarian/consideration-of-deferred-action-for-childhood-arrivals-daca', description: 'Official DACA program overview, eligibility criteria, and Form I-821D.' },
      { title: 'USCIS — Temporary Protected Status', url: 'https://www.uscis.gov/humanitarian/temporary-protected-status', description: 'Current TPS country designations and Form I-821 filing instructions.' },
      { title: 'USCIS — U Visa', url: 'https://www.uscis.gov/working-in-the-united-states/u-visa', description: 'U nonimmigrant status overview for victims of qualifying crimes.' },
      { title: 'USCIS — T Visa', url: 'https://www.uscis.gov/humanitarian/victims-of-human-trafficking-and-other-crimes/victims-of-human-trafficking-t-nonimmigrant-status', description: 'T nonimmigrant status overview for victims of human trafficking.' },
      { title: 'USCIS — VAWA Self-Petitions', url: 'https://www.uscis.gov/humanitarian/abused-spouses-children-and-parents/battered-spouse-children-parents', description: 'Self-petitioning process for abused spouses, children, and parents of U.S. citizens or LPRs.' },
      { title: 'USCIS — Special Immigrant Juvenile Status', url: 'https://www.uscis.gov/working-in-the-united-states/sij-status', description: 'Eligibility and filing process (Form I-360) for Special Immigrant Juvenile status.' },
      { title: 'USCIS — Adjustment of Status (I-485)', url: 'https://www.uscis.gov/i-485', description: 'Application to register permanent residence or adjust status.' },
      { title: 'EOIR — Executive Office for Immigration Review', url: 'https://www.justice.gov/eoir', description: 'Immigration court system; handles cancellation of removal and other relief under § 1229b.' },
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
            primary statutes, case law, regulatory guidance, and data sources underlying both
            the citizenship determination and the separate immigration-status check, plus the
            location context engine.
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
