// src/components/SuccessCheckmark.tsx
// CSS-in-JSX keyframe animation via style tag

export function SuccessCheckmark() {
  return (
    <>
      <style>{`
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fade-scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: draw-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.1s forwards;
        }
        .checkmark-path {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: draw-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.7s forwards;
        }
        .checkmark-wrapper {
          animation: fade-scale-in 0.4s ease forwards;
        }
      `}</style>

      <div className="checkmark-wrapper flex items-center justify-center">
        <svg
          viewBox="0 0 52 52"
          className="w-24 h-24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="checkmark-circle"
            cx="26"
            cy="26"
            r="25"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="checkmark-path"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  )
}
