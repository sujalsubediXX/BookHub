// Generated from the original lamp markup. Class names are prefixed with "la-" (see Auth.css).
export default function LampSvg() {
  return (
    <svg className="la-lamp-svg" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="metalArm" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3e434a" />
                  <stop offset="50%" stopColor="#7a828e" />
                  <stop offset="100%" stopColor="#24272c" />
                </linearGradient>
    
                <linearGradient id="brassJoint" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffe299" />
                  <stop offset="45%" stopColor="#c99738" />
                  <stop offset="85%" stopColor="#805915" />
                  <stop offset="100%" stopColor="#f5d38a" />
                </linearGradient>
    
                <linearGradient id="shadeExterior" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#343840" />
                  <stop offset="40%" stopColor="#21252a" />
                  <stop offset="100%" stopColor="#121417" />
                </linearGradient>
    
                <linearGradient id="shadeHighlight" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="42%" stopColor="#ffffff" stopOpacity="0.16" />
                  <stop offset="72%" stopColor="#ffffff" stopOpacity="0.025" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
    
                <linearGradient id="shadeRim" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffd584" />
                  <stop offset="50%" stopColor="#e2ab46" />
                  <stop offset="100%" stopColor="#996a1a" />
                </linearGradient>
    
                <radialGradient id="reflectorOff" cx="50%" cy="40%" r="70%">
                  <stop offset="0%" stopColor="#2c3036" />
                  <stop offset="55%" stopColor="#1a1d22" />
                  <stop offset="100%" stopColor="#0e1012" />
                </radialGradient>
    
                <radialGradient id="reflectorOn" cx="50%" cy="40%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="var(--lamp-glow, #ffe194)" stopOpacity="0.85" />
                  <stop offset="70%" stopColor="var(--lamp-accent, #ffab3d)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#2a2015" stopOpacity="0.85" />
                </radialGradient>
    
                <linearGradient id="volumetricBeam" x1="0%" y1="0%" x2="90%" y2="70%">
                  <stop offset="0%" stopColor="var(--beam-start, rgba(255, 220, 130, 0.45))" />
                  <stop offset="25%" stopColor="var(--beam-mid, rgba(255, 195, 90, 0.22))" />
                  <stop offset="65%" stopColor="var(--beam-far, rgba(255, 175, 60, 0.08))" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                </linearGradient>
    
                <filter id="bulbGlowFilter" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
    
                <filter id="beamSoftFilter" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="8" />
                </filter>
              </defs>
    
              <ellipse className="la-desk-shadow" cx="190" cy="460" rx="90" ry="16" fill="rgba(0, 0, 0, 0.55)" />
    
              <g className="la-light-beam-group">
                <polygon className="la-svg-light-beam" points="182,185 308,225 820,480 340,510" fill="url(#volumetricBeam)"
                  filter="url(#beamSoftFilter)" />
              </g>
    
              <g className="la-lamp-base-group">
                <ellipse cx="190" cy="445" rx="72" ry="14" fill="#15171a" />
                <ellipse cx="190" cy="443" rx="70" ry="12" fill="url(#metalArm)" />
                <ellipse cx="190" cy="441" rx="66" ry="10" fill="#1c1f24" />
                <ellipse cx="190" cy="439" rx="60" ry="7" fill="none" stroke="#8e949f" strokeOpacity=".22"
                  strokeWidth=".8" />
                <circle cx="190" cy="439" r="15" fill="url(#brassJoint)" />
                <circle cx="190" cy="439" r="7" fill="#15171a" />
                <circle cx="190" cy="439" r="3.2" fill="#747b86" />
              </g>
    
              <g className="la-lamp-arm-lower">
                <line x1="186" y1="439" x2="156" y2="295" stroke="url(#metalArm)" strokeWidth="4.5"
                  strokeLinecap="round" />
                <line x1="194" y1="439" x2="164" y2="295" stroke="url(#metalArm)" strokeWidth="4.5"
                  strokeLinecap="round" />
                <path d="M 188 420 Q 175 360 163 305" stroke="#606670" strokeWidth="2" strokeDasharray="3,3" fill="none"
                  opacity="0.6" />
              </g>
    
              <g className="la-lamp-elbow-joint">
                <circle cx="160" cy="295" r="13" fill="url(#brassJoint)" />
                <circle cx="160" cy="295" r="6" fill="#1c1f24" />
                <circle cx="160" cy="295" r="3.3" fill="#858b94" />
                <line x1="155" y1="295" x2="165" y2="295" stroke="url(#brassJoint)" strokeWidth="2" />
              </g>
    
              <g className="la-lamp-arm-upper">
                <line x1="160" y1="295" x2="215" y2="175" stroke="url(#metalArm)" strokeWidth="5" strokeLinecap="round" />
                <path d="M 190 439 Q 168 360 160 295 Q 190 230 215 175" stroke="#101114" strokeWidth="3" fill="none"
                  strokeLinecap="round" />
              </g>
    
              <g className="la-lamp-neck">
                <circle cx="215" cy="175" r="11" fill="url(#brassJoint)" />
                <rect x="209" y="162" width="16" height="15" rx="3" fill="url(#metalArm)"
                  transform="rotate(25, 217, 169)" />
              </g>
    
              <g className="la-lamp-shade-assembly" id="shadeAssembly">
                <path className="la-lamp-shade-body"
                  d="M 182.3 184.6 C 188 135, 220 112, 248 115 C 275 118, 298 155, 307.7 225.4 A 66 22 18 0 1 182.3 184.6 Z"
                  fill="url(#shadeExterior)" stroke="#16181b" strokeWidth="1.8" />
    
                <path className="la-shade-enamel-highlight"
                  d="M 187 181 C 193 139, 221 119, 247 120 C 267 122, 286 144, 297 178 C 271 163, 224 153, 187 181 Z"
                  fill="url(#shadeHighlight)" />
                <path d="M 204 148 C 216 125, 235 119, 251 122" fill="none" stroke="#aeb5c2" strokeOpacity=".17"
                  strokeWidth="1.2" strokeLinecap="round" />
    
                <ellipse className="la-shade-reflector-off" cx="245" cy="205" rx="66" ry="22" transform="rotate(18, 245, 205)"
                  fill="url(#reflectorOff)" />
    
                <ellipse className="la-shade-reflector-on" cx="245" cy="205" rx="66" ry="22" transform="rotate(18, 245, 205)"
                  fill="url(#reflectorOn)" />
    
                <ellipse className="la-reflector-detail" cx="245" cy="205" rx="49" ry="14" transform="rotate(18, 245, 205)"
                  fill="none" stroke="#fff3ce" strokeOpacity=".16" strokeWidth=".8" />
    
                <ellipse cx="245" cy="205" rx="66" ry="22" transform="rotate(18, 245, 205)" fill="none"
                  stroke="rgba(255, 213, 132, 0.25)" strokeWidth="1" />
    
                <path className="la-shade-rim-trim" d="M 182.3 184.6 A 66 22 18 0 0 307.7 225.4" stroke="url(#shadeRim)"
                  strokeWidth="4" fill="none" strokeLinecap="round" />
    
                <g className="la-bulb-unit" id="bulbUnit">
                  <ellipse className="la-bulb-glass" cx="245" cy="195" rx="14" ry="17" transform="rotate(18, 245, 195)"
                    fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
                  <path d="M 239 190 Q 242 181 247 183" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.2"
                    strokeLinecap="round" />
                  <path className="la-bulb-filament" d="M 241 189 Q 245 183 249 189" stroke="#555" strokeWidth="1.8"
                    fill="none" />
                  <circle className="la-bulb-glow-core" cx="245" cy="188" r="11" fill="var(--lamp-glow, #ffe194)"
                    filter="url(#bulbGlowFilter)" opacity="0" />
                </g>
    
                <g className="la-cord-socket-grommet">
                  <rect x="242" y="206" width="6" height="6" rx="1.5" fill="url(#brassJoint)" stroke="#68420e"
                    strokeWidth="0.8" />
                  <circle cx="245" cy="212" r="3" fill="#ffe299" stroke="#7a5513" strokeWidth="0.8" />
                  <circle cx="245" cy="212" r="1.3" fill="#181105" />
                </g>
              </g>
    
              
              <g className="la-pull-cord-system">
                <path className="la-elastic-cord-path" id="elasticCord" d="M 245 212 L 245 300" stroke="#e8bb54" strokeWidth="2.6"
                  strokeLinecap="round" />
    
                <g className="la-cord-bead-group" id="cordBead" tabIndex={0} role="button" aria-label="Pull the lamp cord to turn the light on or off" cursor="grab">
                  <circle className="la-bead-aura" cx="0" cy="0" r="16" fill="var(--lamp-accent)" opacity="0" />
                  <path className="la-bead-shape" d="M -4 -8 L 4 -8 L 7 6 C 7 10, -7 10, -7 6 Z" fill="url(#brassJoint)"
                    stroke="#7a5513" strokeWidth="0.8" />
                  <ellipse cx="2" cy="0" rx="2" ry="4" fill="#fff" opacity="0.5" />
                  <circle className="la-cord-hit-area" id="cordHit" cx="0" cy="0" r="32" fill="transparent" />
                </g>
              </g>
    
            </svg>
  );
}
