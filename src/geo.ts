const API_BASE = 'https://api.geoborder.metaphase.tech/v1'
const API_KEY = import.meta.env.VITE_GEOBORDER_KEY as string

export interface GeoData {
  // Jurisdiction labels
  state: string | null
  county: string | null
  congressionalDistrict: string | null
  federalJudicialDistrict: string | null

  // Nearest CBP port of entry
  cbpPort: {
    name: string
    portCode: string
    distanceMiles: number
    cardinal: string
  } | null

  // Nearest EOIR immigration court
  immigrationCourt: {
    name: string
    distanceMiles: number
    cardinal: string
  } | null

  // Nearest ICE ERO field office
  iceEro: {
    name: string
    distanceMiles: number
    cardinal: string
  } | null

  // Flags
  inRooseveltReservation: boolean
  inTribalTrustLand: boolean
  tribalName: string | null
}

export async function fetchGeoData(lat: number, lon: number): Promise<GeoData> {
  const include = [
    'state',
    'county',
    'congressional_district',
    'federal_judicial_district',
    'federal_roosevelt_reservation',
    'federal_bia_trust',
    'federal_port_of_entry',
    'federal_immigration_court',
    'ice_ero_field_office',
  ].join(',')

  const url = `${API_BASE}/location?lat=${lat}&lon=${lon}&include=${include}`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  })

  if (!res.ok) throw new Error(`GeoBorder API error: ${res.status}`)

  const data = await res.json()

  // Extract polygon hits by layer
  const hits: Record<string, { name?: string; properties?: Record<string, unknown> }[]> = {}
  for (const feature of data.hits ?? []) {
    const layer = feature.layer_id as string
    if (!hits[layer]) hits[layer] = []
    hits[layer].push(feature)
  }

  const stateFeature   = hits['state']?.[0]
  const countyFeature  = hits['county']?.[0]
  const cdFeature      = hits['congressional_district']?.[0]
  const fjdFeature     = hits['federal_judicial_district']?.[0]
  const tribalFeature  = hits['federal_bia_trust']?.[0]

  // Extract nearest point features by layer
  const nearest: Record<string, {
    name?: string
    identifiers?: Record<string, string>
    distance_miles?: number
    cardinal?: string
    properties?: Record<string, unknown>
  }> = {}
  for (const feature of data.nearest?.features ?? []) {
    const layer = feature.layer_id as string
    if (!nearest[layer]) nearest[layer] = feature
  }

  const cbpRaw   = nearest['federal_port_of_entry']
  const courtRaw = nearest['federal_immigration_court']
  const eroRaw   = nearest['ice_ero_field_office']

  // Clean up congressional district label
  // API may return "Virginia's 11th congressional district" — shorten to "VA-11"
  let cdLabel = cdFeature?.name ?? null
  if (cdLabel) {
    // Try to extract state abbreviation + number
    const stateAbbr = (stateFeature?.properties?.['STUSPS'] as string) ?? null
    const numMatch = cdLabel.match(/(\d+)(st|nd|rd|th)?/i)
    if (stateAbbr && numMatch) {
      cdLabel = `${stateAbbr}-${numMatch[1]}`
    }
  }

  return {
    state: (stateFeature?.properties?.['STUSPS'] as string) ?? stateFeature?.name ?? null,
    county: countyFeature?.name ?? null,
    congressionalDistrict: cdLabel,
    federalJudicialDistrict: fjdFeature?.name ?? null,

    cbpPort: cbpRaw
      ? {
          name: cbpRaw.name ?? 'Unknown Port',
          portCode: cbpRaw.identifiers?.['port_code'] ?? '',
          distanceMiles: Math.round((cbpRaw.distance_miles ?? 0) * 10) / 10,
          cardinal: cbpRaw.cardinal ?? '',
        }
      : null,

    immigrationCourt: courtRaw
      ? {
          name: courtRaw.name ?? 'Unknown Court',
          distanceMiles: Math.round((courtRaw.distance_miles ?? 0) * 10) / 10,
          cardinal: courtRaw.cardinal ?? '',
        }
      : null,

    iceEro: eroRaw
      ? {
          name: eroRaw.name ?? 'Unknown ERO Office',
          distanceMiles: Math.round((eroRaw.distance_miles ?? 0) * 10) / 10,
          cardinal: eroRaw.cardinal ?? '',
        }
      : null,

    inRooseveltReservation: !!hits['federal_roosevelt_reservation']?.length,
    inTribalTrustLand: !!tribalFeature,
    tribalName: tribalFeature?.name ?? null,
  }
}

export function getLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 8000,
      maximumAge: 60_000,
    })
  })
}
