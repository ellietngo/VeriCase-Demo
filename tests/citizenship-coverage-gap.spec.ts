/**
 * Coverage-gap tests targeting the 31 answer branches not exercised by prior
 * test suites. Paths verified against the rules engine JSON via BFS trace.
 *
 * Legal sources:
 *   - 8 U.S.C. § 1401  (nationals and citizens at birth — 50 states + territories)
 *   - 8 U.S.C. § 1402  (Puerto Rico — Jones Act acquisition)
 *   - 8 U.S.C. § 1408  (nationals only — outlying possessions)
 *   - 8 U.S.C. § 1409  (out-of-wedlock births — foreign citizen father)
 *   - 8 U.S.C. § 1431  (Child Citizenship Act)
 *   - 8 U.S.C. § 1481  (loss of nationality — expatriating acts)
 *   - Former INA § 301(b) (retention requirement, pre-1978 births)
 */

import { test, expect, type Page } from '@playwright/test'

async function startDetermination(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /begin determination/i }).click()
}

async function answerSequence(page: Page, answers: string[]) {
  for (const answer of answers) {
    await page.getByRole('group', { name: /answer options/i })
      .getByRole('button', { name: answer, exact: false })
      .click()
  }
}

async function expectOutcome(page: Page, label: 'U.S. Citizen' | 'Not a U.S. Citizen') {
  await expect(
    page.getByRole('heading', { level: 1, name: new RegExp(label, 'i') })
  ).toBeVisible({ timeout: 10_000 })
}

// ── DIPLOMATIC IMMUNITY — LIMITED IMMUNITY PARENT (Q1b) ─────────────────────

test('DIP-01 | Born in US, one parent had only limited diplomatic immunity → U.S. Citizen (§ 1401(a))', async ({ page }) => {
  // § 1401(a) requires being "subject to the jurisdiction" of the US. Full-immunity
  // diplomats are excluded, but a parent with only limited or consular immunity is
  // not fully exempt. The child is therefore born subject to US jurisdiction.
  await startDetermination(page)
  await answerSequence(page, [
    'In the 50 states or D.C.',
    'No (both parents were full-immunity diplomats)',
    'Yes (only limited immunity)',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

// ── FOUNDLING — PARENTAGE SHOWN FOREIGN (Q8 No) ──────────────────────────────

test('FND-01 | Person found in US, NOT a qualifying foundling → naturalization path, requirements not met → Not a U.S. Citizen', async ({ page }) => {
  // § 1401(f): the foundling presumption only applies to persons found in the US
  // under age 5. Someone who does not meet that threshold falls to the general
  // naturalization path. Without LPR status or military service, citizenship is denied.
  await startDetermination(page)
  await answerSequence(page, [
    'Found in the U.S., parentage unknown',
    'No',
    'No',
    'No',
    'No',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

// ── OUTLYING POSSESSIONS — Q7 BOTH BRANCHES ──────────────────────────────────

test('TERR-01 | Born in outlying possession (Midway/Wake), naturalized → U.S. Citizen (§ 1401)', async ({ page }) => {
  // Persons born in other outlying possessions such as Midway or Wake Island are
  // U.S. nationals (§ 1408), but may subsequently naturalize. On the determination
  // path, answering "Yes" at Q7 routes through the no-expatriating-act check.
  await startDetermination(page)
  await answerSequence(page, [
    'In a U.S. territory or possession',
    'Other outlying possession (Midway, Wake, etc.)',
    'Yes',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

test('TERR-02 | Born in outlying possession (Midway/Wake), not naturalized → U.S. National only (§ 1408)', async ({ page }) => {
  // Without naturalization, birth in Midway, Wake, or a similar outlying possession
  // confers only national status under § 1408 — not citizenship.
  await startDetermination(page)
  await answerSequence(page, [
    'In a U.S. territory or possession',
    'Other outlying possession (Midway, Wake, etc.)',
    'No (remains a U.S. national)',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

// ── PUERTO RICO — PRE-1941 JONES ACT ACQUISITION (Q4b) ───────────────────────

test('TERR-03 | Born in Puerto Rico before 1941, acquired citizenship under Jones Act → U.S. Citizen (§ 1402)', async ({ page }) => {
  // The Jones Act of 1917 conferred citizenship on many Puerto Ricans. A person
  // born before January 13, 1941 who affirmatively acquired citizenship under the
  // Jones Act framework is a U.S. citizen.
  await startDetermination(page)
  await answerSequence(page, [
    'In a U.S. territory or possession',
    'Puerto Rico',
    'No (born before 1941)',
    'Yes',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

// ── NATURALIZATION — BROKEN RESIDENCE / INSUFFICIENT PRESENCE (Q43, Q44) ────

test('NAT-03 | LPR, standard path, continuous-residence broken → Not a U.S. Citizen (INA § 316)', async ({ page }) => {
  // INA § 316(a) requires continuous residence in the US for five years as an LPR.
  // A break in that continuous-residence period (e.g. extended foreign trip) resets
  // the clock and the naturalization requirement is not met.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, neither parent a citizen (or unknown)',
    'Yes (LPR)',
    'No (standard 5-year)',
    'Yes',
    'No (broken)',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

test('NAT-04 | LPR, standard path, physical-presence days not met → Not a U.S. Citizen (INA § 316)', async ({ page }) => {
  // INA § 316(a) also requires physical presence in the US for at least half of
  // the five-year residence period. Failing the day-count test — even with unbroken
  // residence — bars naturalization.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, neither parent a citizen (or unknown)',
    'Yes (LPR)',
    'No (standard 5-year)',
    'Yes',
    'Yes (unbroken)',
    'No',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

test('NAT-05 | LPR, standard path, all requirements met → U.S. Citizen (INA §§ 316, 312, 337)', async ({ page }) => {
  // The full standard naturalization checklist: 5-yr LPR, continuous residence,
  // physical presence, good moral character, English/civics, and oath. When every
  // box is checked the engine should confirm citizenship.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, neither parent a citizen (or unknown)',
    'Yes (LPR)',
    'No (standard 5-year)',
    'Yes',
    'Yes (unbroken)',
    'Yes',
    'Yes',
    'Yes or exempt',
    'Yes',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

// ── NATURALIZATION — CHILD NOT OF CITIZEN PARENT (Q60br) ────────────────────

test('NAT-06 | Not LPR, not in military, not child of citizen parent → Not a U.S. Citizen', async ({ page }) => {
  // Without LPR status, military service, or a qualifying citizen parent for the
  // § 1431 / § 1433 Child Citizenship Act paths, no naturalization route is available.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, neither parent a citizen (or unknown)',
    'No',
    'No',
    'No',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

// ── PEACETIME MILITARY — LPR + SERVICE NOT MET (Q42m) ───────────────────────

test('MIL-04 | Peacetime military service, LPR or 1-yr service requirement NOT met → Not a U.S. Citizen', async ({ page }) => {
  // INA § 328 requires both LPR status and at least one year of honorable service
  // for peacetime-era military naturalization. If either is absent, the path is closed.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, neither parent a citizen (or unknown)',
    'No',
    'Yes',
    'No (peacetime: needs 1 yr service + LPR)',
    'No',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

// ── BOTH PARENTS CITIZENS — ONLY ONE RESIDED IN US (Q10) ────────────────────

test('BP-01 | Abroad, both parents citizens, only one resided in US → citizenship through resident parent (§ 1401(c))', async ({ page }) => {
  // § 1401(c): when the subject is born abroad to two citizen parents but only one
  // had prior US residence, the engine routes to the single-citizen-parent path
  // (Q20) to confirm citizenship via that parent.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, both parents were U.S. citizens',
    'No, only one',
    'Nov 14, 1986 onward',
    'Yes, married at birth',
    'Father',
    'Yes (era requirement met)',
    'No (born 1978+ or not subject)',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

// ── CITIZEN PARENT ERA VARIANTS (Q20) ────────────────────────────────────────

test('ERA-01 | Born abroad 1934–1941, citizen father married, presence met → U.S. Citizen (INA transitional era)', async ({ page }) => {
  // The Nationality Act of 1934 first allowed citizenship transmission through
  // citizen mothers on equal footing with fathers. This era (May 24, 1934 –
  // Jan 12, 1941) uses the same married-parent path as later eras.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'May 24, 1934 - Jan 12, 1941',
    'Yes, married at birth',
    'Father',
    'Yes (era requirement met)',
    'No (born 1978+ or not subject)',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

test('ERA-02 | Born abroad 1941–1952, citizen father married, presence met → U.S. Citizen (Nationality Act of 1940)', async ({ page }) => {
  // The Nationality Act of 1940 governed this era. The citizenship transmission
  // rules for married-parent births were similar; this confirms the engine handles
  // the Jan 13, 1941 – Dec 23, 1952 era correctly.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Jan 13, 1941 - Dec 23, 1952',
    'Yes, married at birth',
    'Father',
    'Yes (era requirement met)',
    'No (born 1978+ or not subject)',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

// ── WHICH PARENT WAS THE CITIZEN — MOTHER vs BOTH (Q22) ─────────────────────

test('PAR-01 | Born abroad, married at birth, citizen parent is the MOTHER → U.S. Citizen (§ 1401(g))', async ({ page }) => {
  // § 1401(g) applies regardless of which parent is the citizen. Routing through
  // "Mother" at Q22 should reach the same physical-presence check (Q23) and, on
  // success, confirm citizenship.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Nov 14, 1986 onward',
    'Yes, married at birth',
    'Mother',
    'Yes (era requirement met)',
    'No (born 1978+ or not subject)',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

test('PAR-02 | Born abroad, married at birth, BOTH parents were citizens → Q11 path → U.S. Citizen (§ 1401(c))', async ({ page }) => {
  // If both parents were citizens at the time of birth, § 1401(c) applies and the
  // engine routes to the simpler "both-citizen-parents" check (Q11) rather than the
  // physical-presence test.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Nov 14, 1986 onward',
    'Yes, married at birth',
    'Both',
    'Yes',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

// ── OUT-OF-WEDLOCK — BOTH PARENTS CITIZENS (Q30) ────────────────────────────

test('OOW-06 | Born out of wedlock, BOTH parents are citizens → Q11 path → U.S. Citizen', async ({ page }) => {
  // When both parents are citizens and the child is born out of wedlock, the
  // engine routes to the § 1401(c) both-citizen-parents check (Q11) — simpler
  // than the paternity/acknowledgment rules under § 1409.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Nov 14, 1986 onward',
    'No, not married',
    'Both',
    'Yes',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

// ── OUT-OF-WEDLOCK — CITIZEN FATHER PHYSICAL PRESENCE NOT MET (Q33) ─────────

test('OOW-07 | Born out of wedlock, citizen father, § 1409(a) met but father presence NOT met → naturalization path, requirements not met', async ({ page }) => {
  // § 1409(a) requires the citizen father to have met the era-specific physical-
  // presence threshold (same as § 1401(g)). If he did not, transmission fails and
  // the engine falls through to the naturalization path.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Nov 14, 1986 onward',
    'No, not married',
    'Father',
    'Yes, all four met',
    'No',
    'No',
    'No',
    'No',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

// ── MARRIED AFTER BIRTH — NOT LEGITIMATED (Q34) ─────────────────────────────

test('OOW-08 | Parents married after birth, child NOT legitimated → out-of-wedlock rules apply → father presence not met → Not a U.S. Citizen', async ({ page }) => {
  // INA § 101(b)(1)(C): legitimation before age 18 under the law of the father's
  // domicile would trigger in-wedlock rules. Without it, the out-of-wedlock rules
  // (§ 1409) govern. Here the father's physical-presence requirement is not met,
  // so citizenship does not transmit.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Nov 14, 1986 onward',
    'Married after the birth',
    'No (apply out-of-wedlock rules)',
    'Father',
    'Yes, all four met',
    'No',
    'No',
    'No',
    'No',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

// ── PRE-1934 BIRTH — CITIZEN FATHER PATH (Q25f) ──────────────────────────────

test('PRE34-02 | Born before 1934, citizen father had prior US residence → U.S. Citizen', async ({ page }) => {
  // Before the Nationality Act of 1934, citizenship transmitted only through the
  // father (with prior US residence). If the father had that residence, citizenship
  // vests at birth.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Before May 24, 1934',
    'Father',
    'Yes',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

test('PRE34-03 | Born before 1934, citizen father had NO prior US residence → naturalization path, requirements not met → Not a U.S. Citizen', async ({ page }) => {
  // Without prior US residence by the citizen father, citizenship does not transmit
  // under the pre-1934 rules. The engine falls through to the standard naturalization
  // path; without LPR or military service the outcome is not a citizen.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Before May 24, 1934',
    'Father',
    'No',
    'No',
    'No',
    'No',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

test('PRE34-04 | Born before 1934, citizen mother, NO prior US residence → naturalization path, requirements not met → Not a U.S. Citizen', async ({ page }) => {
  // Before 1934, citizenship could not transmit through a citizen mother unless she
  // had prior US residence. Without that residence, the engine falls through to the
  // naturalization path.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Before May 24, 1934',
    'Mother',
    'No',
    'No',
    'No',
    'No',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

// ── RETENTION REQUIREMENT — RE-ACQUISITION PATH (Q80reacq / Q81marr) ────────

test('RET-02 | Pre-1978, failed to retain, took re-acquisition oath → U.S. Citizen (former § 301(b) + § 324)', async ({ page }) => {
  // Former INA § 301(b) imposed a 2-year residence retention requirement. If that
  // was not met, § 324 allowed re-acquisition of citizenship by taking the oath of
  // allegiance before age 26. Doing so restores citizenship.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Dec 24, 1952 - Nov 13, 1986',
    'Yes, married at birth',
    'Father',
    'Yes (era requirement met)',
    'Yes (subject to retention rule)',
    'No (lost for failure to retain)',
    'Yes (oath taken)',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

test('RET-03 | Pre-1978, failed to retain, re-acquisition oath NOT taken, married to citizen and regained → U.S. Citizen', async ({ page }) => {
  // If the oath was not taken, the engine checks whether citizenship was regained
  // through marriage to a U.S. citizen (a route that was historically available
  // for women under prior law).
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Dec 24, 1952 - Nov 13, 1986',
    'Yes, married at birth',
    'Father',
    'Yes (era requirement met)',
    'Yes (subject to retention rule)',
    'No (lost for failure to retain)',
    'No (check marriage-loss route)',
    'Yes',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

test('RET-04 | Pre-1978, failed to retain, no oath, no marriage-based regain → Not a U.S. Citizen (CLN required)', async ({ page }) => {
  // If neither the re-acquisition oath nor the marriage route applies, the
  // citizenship loss is considered final (evidenced by a CLN — Certificate of
  // Loss of Nationality).
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Dec 24, 1952 - Nov 13, 1986',
    'Yes, married at birth',
    'Father',
    'Yes (era requirement met)',
    'Yes (subject to retention rule)',
    'No (lost for failure to retain)',
    'No (check marriage-loss route)',
    'No (remains a non-citizen)',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})
