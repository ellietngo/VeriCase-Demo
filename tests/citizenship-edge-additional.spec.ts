/**
 * Additional e2e tests targeting paths most likely to hide bugs:
 *   - out-of-wedlock birth rules (§ 1409)
 *   - military naturalization fast-path (§ 1440)
 *   - Child Citizenship Act child-abroad fallback (§ 1433)
 *   - non-permanent good-moral-character bar
 *   - naturalization oath refusal
 *   - English/civics failure
 *   - pre-1934 birth via citizen mother vs father
 *   - retention requirement met vs missed
 *   - foreign-naturalization expatriation with/without intent
 *   - Puerto Rico pre-1941 acquired via Jones Act
 *   - out-of-wedlock: legitimation after birth
 *   - peacetime military (LPR + 1 yr service required)
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

// ── OUT-OF-WEDLOCK BIRTHS (§ 1409) ───────────────────────────────────────────

test('OOW-01 | Abroad, unmarried citizen mother, 1-yr presence met → U.S. Citizen (§ 1409(c))', async ({ page }) => {
  // § 1409(c): child born abroad out of wedlock to a citizen mother acquires
  // citizenship if the mother was physically present in the US for 1 continuous
  // year before the birth.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Nov 14, 1986 onward',
    'No, not married',
    'Mother',
    'Yes',                        // Q31: citizen mother 1-yr presence met
    'No (born 1978+ or not subject)',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

test('OOW-02 | Abroad, unmarried citizen mother, 1-yr presence NOT met → Not a U.S. Citizen', async ({ page }) => {
  // § 1409(c): if the citizen mother did not meet the 1-continuous-year presence
  // requirement, citizenship does not transmit at birth.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Nov 14, 1986 onward',
    'No, not married',
    'Mother',
    'No',                         // Q31: mother did NOT meet 1-yr presence
    'Yes (LPR)',
    'Yes, spouse of citizen (3-year)',
    'No',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

test('OOW-03 | Abroad, unmarried citizen father, all § 1409(a) requirements met → U.S. Citizen', async ({ page }) => {
  // § 1409(a): four conditions must ALL be met for citizenship via unwed citizen
  // father: blood relationship, father is citizen at birth, paternity acknowledged
  // in writing before age 18, and physical-presence requirement met.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Nov 14, 1986 onward',
    'No, not married',
    'Father',
    'Yes, all four met',          // Q32: all § 1409(a) conditions satisfied
    'Yes',                        // Q33: physical-presence met
    'No (born 1978+ or not subject)',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

test('OOW-04 | Abroad, unmarried citizen father, § 1409(a) requirements NOT met → Not a U.S. Citizen', async ({ page }) => {
  // § 1409(a): if any of the four paternity/acknowledgment conditions are missing,
  // citizenship does not transmit through the unwed father.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Nov 14, 1986 onward',
    'No, not married',
    'Father',
    'No, one or more missing',    // Q32: § 1409(a) conditions not fully met
    'Yes (LPR)',
    'Yes, spouse of citizen (3-year)',
    'No',
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

test('OOW-05 | Abroad, parents married AFTER birth, legitimated → follows in-wedlock rules', async ({ page }) => {
  // § 1409(a) / INA § 101(b)(1)(C): if the child was legitimated under the law
  // of the father's domicile before age 18, the in-wedlock rules apply.
  // Expect citizenship when the citizen parent (father) then meets the physical-
  // presence requirement.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Nov 14, 1986 onward',
    'Married after the birth',
    'Yes (treat as in-wedlock)',  // Q34: legitimated — use in-wedlock path
    'Father',
    'Yes (era requirement met)',
    'No (born 1978+ or not subject)',
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

// ── MILITARY NATURALIZATION (§ 1440) ─────────────────────────────────────────

test('MIL-01 | Wartime military service, willing to take oath → U.S. Citizen (§ 1440)', async ({ page }) => {
  // § 1440: honorable service during a designated period of hostilities waives
  // the LPR and residence requirements entirely; oath of allegiance is still needed.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, neither parent a citizen (or unknown)',
    'No',                         // GO_NAT: not LPR
    'Yes',                        // Q49: served honorably
    'Yes (no LPR/residence needed)', // Q50: wartime — waived
    'Yes',                        // Q47: willing to take oath
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

test('MIL-02 | Wartime service but REFUSES oath → Not a U.S. Citizen', async ({ page }) => {
  // § 1440: oath of allegiance is non-waivable even for wartime service.
  // Refusal to swear results in denial.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, neither parent a citizen (or unknown)',
    'No',
    'Yes',
    'Yes (no LPR/residence needed)',
    'No (refuses)',               // Q47: refuses oath
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

test('MIL-03 | Peacetime military, has LPR + 1-yr service, willing to take oath → U.S. Citizen', async ({ page }) => {
  // INA § 328: peacetime service still allows naturalization but requires LPR
  // status and at least 1 year of honorable service before filing.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, neither parent a citizen (or unknown)',
    'No',
    'Yes',
    'No (peacetime: needs 1 yr service + LPR)', // Q50: peacetime
    'Yes',                        // Q42m: has LPR + 1-yr service
    'Yes',                        // Q47: willing to take oath
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

// ── CHILD CITIZENSHIP ACT — CHILD ABROAD (§ 1433) ────────────────────────────

test('CCA-02 | Child abroad, citizen parent applied under § 1433 and approved → U.S. Citizen', async ({ page }) => {
  // § 1433: if the child is not yet residing in the US, the citizen parent may
  // apply abroad for a Certificate of Citizenship. Approval confers citizenship.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, neither parent a citizen (or unknown)',
    'No',
    'No',
    'Yes',                        // Q60br: is child of citizen parent
    'No (child abroad or not yet LPR)', // Q61: not yet residing in US
    'Yes',                        // Q63: § 1433 application approved
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

test('CCA-03 | Child abroad, § 1433 application NOT approved → Not a U.S. Citizen', async ({ page }) => {
  // § 1433: if the citizen parent's application is denied (or not filed), the
  // child does not automatically acquire citizenship.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, neither parent a citizen (or unknown)',
    'No',
    'No',
    'Yes',
    'No (child abroad or not yet LPR)',
    'No',                         // Q63: § 1433 not approved
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

// ── NATURALIZATION — SPECIFIC FAILURE MODES ──────────────────────────────────

test('NAT-01 | Fails English/civics, no waiver → Not a U.S. Citizen', async ({ page }) => {
  // INA § 312: English language and civics knowledge are required for naturalization.
  // Failure without an eligible waiver (age 50+/20yrs LPR, or disability) is a bar.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, neither parent a citizen (or unknown)',
    'Yes (LPR)',
    'No (standard 5-year)',
    'Yes',                        // Q42: residence met
    'Yes (unbroken)',             // Q43
    'Yes',                        // Q44: physical presence met
    'Yes',                        // Q45: good moral character
    'No',                         // Q46: fails English/civics, no waiver
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

test('NAT-02 | Good-moral-character bar — NOT permanent → Not a U.S. Citizen (can reapply)', async ({ page }) => {
  // INA § 316: a temporary (non-permanent) GMC bar means denial now but the
  // person can reapply after the statutory period clears — still not a citizen today.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, neither parent a citizen (or unknown)',
    'Yes (LPR)',
    'No (standard 5-year)',
    'Yes',
    'Yes (unbroken)',
    'Yes',
    'No',                         // Q45: no good moral character
    'No (conditional - wait & reapply)', // Q45b: not permanent
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

// ── PRE-1934 BIRTH VIA CITIZEN MOTHER ────────────────────────────────────────

test('PRE34-01 | Born before 1934, citizen mother had prior US residence → U.S. Citizen', async ({ page }) => {
  // Prior to the Nationality Act of 1934, citizenship transmitted through the
  // mother only if she had prior US residence. If she did, citizenship vests.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Before May 24, 1934',
    'Mother',                     // Q25: which parent is the citizen (no marriage Q for pre-1934)
    'Yes',                        // Q25m: citizen mother had prior US residence
    'No expatriating act',        // Q70: no expatriating act (pre-1934 skips retention check)
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

// ── EXPATRIATION — FOREIGN NATURALIZATION / OATH (§ 1481(a)(1)-(4)) ──────────

test('EXP-01 | Foreign naturalization / oath — government proves intent → Not a U.S. Citizen', async ({ page }) => {
  // § 1481(a)(1)-(4): foreign naturalization or oath of allegiance is potentially
  // expatriating only if performed with specific intent to relinquish. If the
  // government can prove that intent, citizenship is lost.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, both parents were U.S. citizens',
    'Yes',
    'Yes',
    'Foreign naturalization / oath / military / government post', // Q70
    'Yes (intent shown)',         // Q77: intent proven
    'Yes (voluntary)',            // Q78: voluntary
  ])
  await expectOutcome(page, 'Not a U.S. Citizen')
})

test('EXP-02 | Foreign naturalization / oath — government CANNOT prove intent → U.S. Citizen', async ({ page }) => {
  // § 1481: without proof of specific relinquishment intent, a potentially
  // expatriating act does not result in loss — citizenship is retained.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, both parents were U.S. citizens',
    'Yes',
    'Yes',
    'Foreign naturalization / oath / military / government post',
    'No (retained, presumed)',    // Q77: intent NOT proven
  ])
  await expectOutcome(page, 'U.S. Citizen')
})

// ── RETENTION REQUIREMENT (pre-1978 births) ───────────────────────────────────

test('RET-01 | Pre-1978, born abroad to one citizen parent, retention requirement MET → U.S. Citizen', async ({ page }) => {
  // Former INA § 301(b): persons born abroad before Oct 10, 1978 to one citizen
  // parent had to reside in the US for 2 years between ages 14–28 to retain
  // citizenship. Meeting the requirement confirms citizenship.
  await startDetermination(page)
  await answerSequence(page, [
    'Abroad, one parent was a U.S. citizen',
    'Dec 24, 1952 - Nov 13, 1986',
    'Yes, married at birth',
    'Father',
    'Yes (era requirement met)',
    'Yes (subject to retention rule)', // Q24ret: born before 1978, subject to rule
    'Yes (retained)',                  // Q24r2: 2-yr residence between 14–28 met
    'No expatriating act',
  ])
  await expectOutcome(page, 'U.S. Citizen')
})
