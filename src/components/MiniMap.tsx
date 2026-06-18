import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// A small, modern interactive map for the result card's location context.
// Deliberately NOT the stock OpenStreetMap iframe embed (zoom buttons, logo,
// "report a problem" link baked in, light/aerial-looking default style) and
// NOT satellite imagery. Uses CARTO's free dark vector-style raster basemap
// so it matches the app's dark theme natively, with a custom pulsing pin
// instead of Leaflet's default marker icon (sidesteps the broken-marker-image
// issue bundlers have with Leaflet's default asset paths).
export default function MiniMap({
  latitude,
  longitude,
  height = 160,
}: {
  latitude: number
  longitude: number
  height?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: 11,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false, // don't hijack page scroll
      dragging: true,
      doubleClickZoom: true,
    })
    mapRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const icon = L.divIcon({
      className: '',
      html: `
        <span style="position:relative;display:block;width:14px;height:14px;">
          <span style="position:absolute;inset:0;border-radius:9999px;background:#4ade80;opacity:0.55;animation:pulse-out 2.2s ease-out infinite;"></span>
          <span style="position:absolute;inset:0;border-radius:9999px;background:#16a34a;border:2px solid #052e16;box-shadow:0 0 0 2px rgba(74,222,128,0.4);"></span>
        </span>
      `,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    })
    L.marker([latitude, longitude], { icon, keyboard: false }).addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [latitude, longitude])

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%', background: '#0a1f14' }}
      role="img"
      aria-label="Map showing the determination's approximate location"
    />
  )
}
