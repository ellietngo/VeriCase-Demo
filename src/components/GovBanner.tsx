export default function GovBanner() {
  return (
    <div
      className="w-full flex items-center justify-between px-4 py-1"
      style={{ background: '#1a2332', fontSize: 11, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}
    >
      <span className="flex items-center gap-1.5 font-medium">
        <span aria-hidden="true">🇺🇸</span>
        For authorized government personnel only
      </span>
      <span className="hidden sm:block font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
        No data collected or stored
      </span>
    </div>
  )
}
