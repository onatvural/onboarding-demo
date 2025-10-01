export function BotIconAnimated({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <style>{`
        @keyframes eyeRoll {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(0, -8px); }
          50% { transform: translate(-6px, -8px); }
          75% { transform: translate(6px, -8px); }
        }

        .eye {
          animation: eyeRoll 2s ease-in-out infinite;
        }
      `}</style>

      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="#333"/>

      {/* Animated eyes */}
      <circle className="eye" cx="38" cy="50" r="6" fill="#fff"/>
      <circle className="eye" cx="62" cy="50" r="6" fill="#fff"/>
    </svg>
  );
}
