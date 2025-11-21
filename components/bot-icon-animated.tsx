export function BotIconAnimated({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full ${className}`} style={{ backgroundColor: 'rgba(251, 251, 242, 0.05)' }}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        xmlns="http://www.w3.org/2000/svg"
        className="thinking"
      >
        <defs>
          {/* Glassmorphic gradient 1 - Cyan */}
          <radialGradient id="glassGrad1Animated">
            <stop offset="0%" style={{ stopColor: '#00E5FF', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: '#00B8D4', stopOpacity: 0.2 }} />
          </radialGradient>

          {/* Glassmorphic gradient 2 - Blue */}
          <radialGradient id="glassGrad2Animated">
            <stop offset="0%" style={{ stopColor: '#40C4FF', stopOpacity: 0.35 }} />
            <stop offset="100%" style={{ stopColor: '#0091EA', stopOpacity: 0.15 }} />
          </radialGradient>

          {/* Glassmorphic gradient 3 - Light Blue */}
          <radialGradient id="glassGrad3Animated">
            <stop offset="0%" style={{ stopColor: '#80DEEA', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#00ACC1', stopOpacity: 0.1 }} />
          </radialGradient>

          {/* Glassmorphic gradient 4 - Pink/Red */}
          <radialGradient id="glassGrad4Animated">
            <stop offset="0%" style={{ stopColor: '#FF6B9D', stopOpacity: 0.35 }} />
            <stop offset="100%" style={{ stopColor: '#C2185B', stopOpacity: 0.15 }} />
          </radialGradient>

          {/* Blur filter */}
          <filter id="blurAnimated">
            <feGaussianBlur stdDeviation="1.2"/>
          </filter>

          {/* Maske - Ana daire sınırı */}
          <clipPath id="sphereMaskAnimated">
            <circle cx="15" cy="15" r="12"/>
          </clipPath>
        </defs>

        {/* İçerik grubu - maske uygulanacak */}
        <g clipPath="url(#sphereMaskAnimated)">

          {/* Hareketli cam daire 1 */}
          <circle cx="15" cy="15" r="8"
                  fill="url(#glassGrad1Animated)"
                  filter="url(#blurAnimated)">
            <animate attributeName="cx"
                     values="15;18;15;12;15"
                     dur="5s"
                     repeatCount="indefinite"/>
            <animate attributeName="cy"
                     values="15;12;18;15;15"
                     dur="5s"
                     repeatCount="indefinite"/>
          </circle>

          {/* Hareketli cam daire 2 */}
          <circle cx="15" cy="15" r="7"
                  fill="url(#glassGrad2Animated)"
                  filter="url(#blurAnimated)">
            <animate attributeName="cx"
                     values="15;12;18;15;15"
                     dur="6.5s"
                     repeatCount="indefinite"/>
            <animate attributeName="cy"
                     values="15;18;12;18;15"
                     dur="6.5s"
                     repeatCount="indefinite"/>
          </circle>

          {/* Hareketli cam daire 3 */}
          <circle cx="15" cy="15" r="6"
                  fill="url(#glassGrad3Animated)"
                  filter="url(#blurAnimated)">
            <animate attributeName="cx"
                     values="15;17;13;17;15"
                     dur="7s"
                     repeatCount="indefinite"/>
            <animate attributeName="cy"
                     values="15;13;17;13;15"
                     dur="7s"
                     repeatCount="indefinite"/>
          </circle>

          {/* Hareketli cam daire 4 - Pink/Red */}
          <circle cx="15" cy="15" r="5.5"
                  fill="url(#glassGrad4Animated)"
                  filter="url(#blurAnimated)">
            <animate attributeName="cx"
                     values="15;13;17;13;15"
                     dur="5.8s"
                     repeatCount="indefinite"/>
            <animate attributeName="cy"
                     values="15;17;13;17;15"
                     dur="5.8s"
                     repeatCount="indefinite"/>
          </circle>

        </g>
      </svg>
    </div>
  );
}
