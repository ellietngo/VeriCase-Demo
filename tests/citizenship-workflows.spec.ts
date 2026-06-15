/**
 * Citizenship determination e2e tests.
 *
 * Common workflows (10): the most frequently travelled legal paths through the engine.
 * Edge cases (10): rare or boundary scenarios verified against statute.
 *
 * Legal sources:
 *   - 8 U.S.C. § 1401  (nationals and citizens at birth)
 *   - 8 U.S.C. § 1402  (Puerto Rico)
 *   - 8 U.S.C. § 1403  (Canal Zone)
 *   - 8 U.S.C. § 1408  (nationals, not citizens — American Samoa)
 *   - 8 U.S.C. § 1431  (Child Citizenship Act)
 *   - 8 U.S.C. § 1481  (loss of nationality / expatriation)
 *   - USCIS Policy Manual Vol. 12
 */

import { test, expect, type Page } from '@playwright/test'

// ── helpers ──────────────────────────────────────────────────────────────────

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
  await expect(page.getByRole('heading', { level: 1, name: new RegExp(label, 'i') })).toBeVisible({ timeout: 10_000 })
}

// ── COMMON WORKFLOWS (10) ─────────────────────────────────────────────────────

test.describe('Common workflows', () => {

  test('CW-01 | Born in 50 states, non-diplomat parent → U.S. Citizen (14th Amdt / § 1401(a))', async ({ page }) => {
    // Statute: 14th Amendment + 8 U.S.C. § 1401(a). Anyone born in the US to a
    // parent not entitled to full diplomatic immunity is a citizen at birth.
    await startDetermination(page)
    await answerSequence(page, [
      'In the 50 states or D.C.',
      'Yes (parent was not a full-immunity diplomat)',
      'No expatriating act',
    ])
    await expectOutcome(page, 'U.S. Citizen')
  })

  test('CW-02 | Born in Puerto Rico on/after 13 Jan 1941 → U.S. Citizen (§ 1402)', async ({ page }) => {
    // Statute: 8 U.S.C. § 1402. Jones Act 1917 + subsequent legislation conferred
    // citizenship on persons born in PR on or after the operative date.
    await startDetermination(page)
    await answerSequence(page, [
      'In a U.S. territory or possession',
      'Puerto Rico',
      'Yes',
      'No expatriating act',
    ])
    await expectOutcome(page, 'U.S. Citizen')
  })

  test('CW-03 | Born in Guam → U.S. Citizen (§ 1401 / Organic Act of Guam)', async ({ page }) => {
    // Statute: Guam Organic Act 1950 + 8 U.S.C. § 1401(d). Birth in Guam confers
    // citizenship regardless of parentage.
    await startDetermination(page)
    await answerSequence(page, [
      'In a U.S. territory or possession',
      'Guam',
      'No expatriating act',
    ])
    await expectOutcome(page, 'U.S. Citizen')
  })

  test('CW-04 | Born abroad, both parents US citizens, one resided in US → U.S. Citizen (§ 1401(c))', async ({ page }) => {
    // Statute: 8 U.S.C. § 1401(c). When both parents are citizens and at least one
    // had a prior US residence, citizenship transmits at birth with no physical-
    // presence minimum.
    await startDetermination(page)
    await answerSequence(page, [
      'Abroad, both parents were U.S. citizens',
      'Yes',
      'Yes',
      'No expatriating act',
    ])
    await expectOutcome(page, 'U.S. Citizen')
  })

  test('CW-05 | American Samoa birth, never naturalized → U.S. National only (§ 1408)', async ({ page }) => {
    // Statute: 8 U.S.C. § 1408. American Samoa is an unincorporated territory;
    // birth there confers national (not citizen) status. Confirmed by SCOTUS in
    // Fitisemanu v. United States (10th Cir. 2021).
    await startDetermination(page)
    await answerSequence(page, [
      'In a U.S. territory or possession',
      'American Samoa or Swains Island',
      'No (remains a U.S. national)',
    ])
    await expectOutcome(page, 'Not a U.S. Citizen')
  })

  test('CW-06 | Foundling found in US under age 5, presumption not rebutted → U.S. Citizen (§ 1401(f))', async ({ page }) => {
    // Statute: 8 U.S.C. § 1401(f). A person found in the US under age 5 with
    // unknown parents is presumed born in the US until shown otherwise before age 21.
    await startDetermination(page)
    await answerSequence(page, [
      'Found in the U.S., parentage unknown',
      'Yes (foundling)',
      'No (presumption stands)',
      'No expatriating act',
    ])
    await expectOutcome(page, 'U.S. Citizen')
  })

  test('CW-07 | Born abroad, voluntary formal renunciation → Not a U.S. Citizen (§ 1481)', async ({ page }) => {
    // Statute: 8 U.S.C. § 1481(a)(5)–(6). Formal renunciation before a consular
    // officer, performed voluntarily with intent, results in loss of citizenship.
    await startDetermination(page)
    await answerSequence(page, [
      'Abroad, both parents were U.S. citizens',
      'Yes',
      'Yes',
      'Formal renunciation or treason conviction',
      'Yes (voluntary)',
    ])
    await expectOutcome(page, 'Not a U.S. Citizen')
  })

  test('CW-08 | Child Citizenship Act — LPR child, under 18, in custody of citizen parent → U.S. Citizen (§ 1431)', async ({ page }) => {
    // Statute: 8 U.S.C. § 1431(a). Citizenship automatically vests when: (1) one
    // parent is a citizen, (2) child is under 18, (3) child is an LPR residing in
    // the US in the legal/physical custody of the citizen parent.
    await startDetermination(page)
    await answerSequence(page, [
      'Abroad, neither parent a citizen (or unknown)',
      'No',
      'No',
      'Yes',
      'Yes (all conditions met)',
      'No expatriating act',
    ])
    await expectOutcome(page, 'U.S. Citizen')
  })

  test('CW-09 | American Samoa birth, later naturalized → U.S. Citizen', async ({ page }) => {
    // Fact: U.S. nationals from American Samoa may naturalize under the standard
    // INA naturalization process; upon naturalization they become full citizens.
    await startDetermination(page)
    await answerSequence(page, [
      'In a U.S. territory or possession',
      'American Samoa or Swains Island',
      'Yes, naturalized',
      'No expatriating act',
    ])
    await expectOutcome(page, 'U.S. Citizen')
  })

  test('CW-10 | Canal Zone birth, one citizen parent → U.S. Citizen (§ 1403)', async ({ page }) => {
    // Statute: 8 U.S.C. § 1403. Persons born in the Canal Zone on or after
    // February 26, 1904 to at least one citizen parent are citizens at birth.
    await startDetermination(page)
    await answerSequence(page, [
      'In a U.S. territory or possession',
      'Panama Canal Zone',
      'Yes',
      'No expatriating act',
    ])
    await expectOutcome(page, 'U.S. Citizen')
  })

})

// ── EDGE CASES (10) ──────────────────────────────────────────────────────────

test.describe('Edge cases', () => {

  test('EC-01 | Born in Puerto Rico BEFORE 1941, no subsequent acquisition → Not a U.S. Citizen', async ({ page }) => {
    // Stat: Jones Act 1917 granted citizenship, but the operative date for § 1402
    // is January 13, 1941. Pre-1941 births without separate acquisition remain
    // "citizens of Puerto Rico" only unless they acquired under prior law.
    await startDetermination(page)
    await answerSequence(page, [
      'In a U.S. territory or possession',
      'Puerto Rico',
      'No (born before 1941)',
      'No (remained Puerto Rican citizen only)',
    ])
    await expectOutcome(page, 'Not a U.S. Citizen')
  })

  test('EC-02 | Canal Zone birth, NO citizen parent → Not a U.S. Citizen', async ({ page }) => {
    // Stat: 8 U.S.C. § 1403 requires at least one citizen parent. Absent that,
    // Canal Zone birth falls through to the naturalization path; without meeting
    // naturalization requirements the person is not a citizen.
    await startDetermination(page)
    await answerSequence(page, [
      'In a U.S. territory or possession',
      'Panama Canal Zone',
      'No',
      'Yes (LPR)',
      'Yes, spouse of citizen (3-year)',
      'No',
    ])
    await expectOutcome(page, 'Not a U.S. Citizen')
  })

  test('EC-03 | Foundling — parentage shown foreign before age 21 → Not a U.S. Citizen', async ({ page }) => {
    // Stat: 8 U.S.C. § 1401(f). The presumption of US birth for foundlings is
    // rebuttable. If it is shown before age 21 that the person was born abroad to
    // alien parents, citizenship does not attach.
    await startDetermination(page)
    await answerSequence(page, [
      'Found in the U.S., parentage unknown',
      'Yes (foundling)',
      'Yes (presumption rebutted)',
    ])
    await expectOutcome(page, 'Not a U.S. Citizen')
  })

  test('EC-04 | Born in US to full-immunity diplomat → Not a U.S. Citizen', async ({ page }) => {
    // Stat: 14th Amdt + § 1401(a) require being "subject to the jurisdiction" of
    // the US. Children of heads of mission with full diplomatic immunity are
    // excluded; USCIS Policy Manual Vol. 12 confirms this exclusion.
    // After the diplomatic exclusion the engine continues to the naturalization path.
    await startDetermination(page)
    await answerSequence(page, [
      'In the 50 states or D.C.',
      'No (both parents were full-immunity diplomats)',
      'No (both fully immune)',
      'Yes (LPR)',
      'Yes, spouse of citizen (3-year)',
      'No',
    ])
    await expectOutcome(page, 'Not a U.S. Citizen')
  })

  test('EC-05 | Born abroad, both parents citizens, neither ever resided in US → Not a U.S. Citizen', async ({ page }) => {
    // Stat: 8 U.S.C. § 1401(c) requires that at least one citizen parent had a
    // prior residence in the US or an outlying possession. If neither parent ever
    // resided in the US, citizenship does not transmit at birth; the engine
    // continues to the naturalization path.
    await startDetermination(page)
    await answerSequence(page, [
      'Abroad, both parents were U.S. citizens',
      'Yes',
      'No',
      'Yes (LPR)',
      'Yes, spouse of citizen (3-year)',
      'No',
    ])
    await expectOutcome(page, 'Not a U.S. Citizen')
  })

  test('EC-06 | LPR naturalization path — permanent good-moral-character bar → Not a U.S. Citizen', async ({ page }) => {
    // Stat: INA § 316 + § 101(f). Certain convictions (e.g. murder, aggravated
    // felony) create a permanent bar to the good-moral-character finding required
    // for naturalization, foreclosing citizenship regardless of other criteria.
    await startDetermination(page)
    await answerSequence(page, [
      'Abroad, neither parent a citizen (or unknown)',
      'Yes (LPR)',
      'Yes, spouse of citizen (3-year)',
      'Yes',
      'Yes (unbroken)',
      'Yes',
      'No',
      'Yes (permanent bar)',
    ])
    await expectOutcome(page, 'Not a U.S. Citizen')
  })

  test('EC-07 | Renunciation — act NOT voluntary → citizenship retained (§ 1481)', async ({ page }) => {
    // Stat: 8 U.S.C. § 1481 requires voluntariness. Duress, coercion, or lack of
    // intent rebuts the expatriating act; citizenship is not lost in such cases.
    await startDetermination(page)
    await answerSequence(page, [
      'Abroad, both parents were U.S. citizens',
      'Yes',
      'Yes',
      'Formal renunciation or treason conviction',
      'No (duress or no understanding)',
    ])
    await expectOutcome(page, 'U.S. Citizen')
  })

  test('EC-08 | No expatriating act performed → citizenship confirmed (§ 1481)', async ({ page }) => {
    // Stat: Absent a qualifying expatriating act under § 1481, a citizen who
    // acquired citizenship at birth retains it. The engine should confirm status.
    await startDetermination(page)
    await answerSequence(page, [
      'Abroad, both parents were U.S. citizens',
      'Yes',
      'Yes',
      'No expatriating act',
    ])
    await expectOutcome(page, 'U.S. Citizen')
  })

  test('EC-09 | Born abroad, one citizen parent, physical-presence NOT met → Not a U.S. Citizen (§ 1401(g))', async ({ page }) => {
    // Stat: 8 U.S.C. § 1401(g). Where only one parent is a citizen, that parent
    // must have met the era-specific physical-presence requirement. Failure routes
    // to the naturalization path; without meeting naturalization requirements,
    // citizenship does not attach.
    await startDetermination(page)
    await answerSequence(page, [
      'Abroad, one parent was a U.S. citizen',
      'Nov 14, 1986 onward',
      'Yes, married at birth',
      'Father',
      'No',
      'Yes (LPR)',
      'Yes, spouse of citizen (3-year)',
      'No',
    ])
    await expectOutcome(page, 'Not a U.S. Citizen')
  })

  test('EC-10 | Born abroad, one citizen parent, physical-presence met → U.S. Citizen (§ 1401(g))', async ({ page }) => {
    // Stat: 8 U.S.C. § 1401(g). If the citizen parent meets the era-specific
    // physical-presence requirement, citizenship transmits at birth even with only
    // one citizen parent.
    await startDetermination(page)
    await answerSequence(page, [
      'Abroad, one parent was a U.S. citizen',
      'Nov 14, 1986 onward',
      'Yes, married at birth',
      'Father',
      'Yes (era requirement met)',
      'No (born 1978+ or not subject)',
      'No expatriating act',
    ])
    await expectOutcome(page, 'U.S. Citizen')
  })

})
