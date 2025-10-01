export function BotIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="#333"/>

      {/* Eyes */}
      <circle cx="38" cy="50" r="6" fill="#fff"/>
      <circle cx="62" cy="50" r="6" fill="#fff"/>
    </svg>
  );
}
