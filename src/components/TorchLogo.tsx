export default function TorchLogo({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Handle — tapered bottom third */}
      <rect x="10.5" y="16" width="3" height="6" rx="1.5" fill="currentColor" opacity="0.85" />
      {/* Cup/cresset */}
      <path d="M8 10 L16 10 L14.5 16 L9.5 16 Z" fill="currentColor" opacity="0.9" />
      {/* Outer flame */}
      <path
        d="M12 2 C10 4 8.5 5.5 9 7.5 C9.3 9 10.5 9.8 12 10 C13.5 9.8 14.7 9 15 7.5 C15.5 5.5 14 4 12 2 Z"
        fill="currentColor"
      />
      {/* Inner flame glow */}
      <path
        d="M12 4.5 C11 5.8 10.5 6.8 11 8 C11.3 8.7 11.7 9 12 9 C12.3 9 12.7 8.7 13 8 C13.5 6.8 13 5.8 12 4.5 Z"
        fill="white"
        opacity="0.45"
      />
    </svg>
  )
}
