import React from 'react';

// Hieroglyphic Text Component
export const HieroglyphicText = ({ text, className = "" }: { text: string; className?: string }) => {
  return (
    <div className={`font-hieroglyphic text-ocean-blue ${className}`}>
      {text}
    </div>
  );
};

// Egyptian Decorative Border
export const EgyptianBorder = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-full h-2 bg-gradient-to-r from-transparent via-coral-bright to-transparent ${className}`}>
      <div className="w-full h-full bg-repeat-x opacity-60" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='8' viewBox='0 0 40 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4l4-4h8l4 4-4 4h-8l-4-4zm16 0l4-4h8l4 4-4 4h-8l-4-4z' fill='%23D4AF37'/%3E%3C/svg%3E")`
           }}>
      </div>
    </div>
  );
};

// Obelisk Shape Container
export const ObeliskContainer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Obelisk Shape */}
      <div className="relative bg-gradient-to-b from-ocean-blue/20 via-ocean-blue/10 to-white/20 
                      backdrop-blur-sm bg-white/95 border-2 border-ocean-blue/30 rounded-t-3xl rounded-b-lg
                      shadow-2xl shadow-ocean-blue/20">
        {/* Pyramid Top */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-0 h-0 
                        border-l-[30px] border-r-[30px] border-b-[24px] 
                        border-l-transparent border-r-transparent border-b-ocean-blue/80">
        </div>
        
        {/* Hieroglyphic Decorations */}
        <div className="absolute top-4 left-4 text-ocean-blue/60 text-sm">
          𓎢 𓃭 𓅂
        </div>
        <div className="absolute top-4 right-4 text-ocean-blue/60 text-sm">
          𓅱 𓄿 𓂋
        </div>
        
        {/* Content */}
        <div className="p-8 pt-12">
          {children}
        </div>
        
        {/* Bottom Hieroglyphic Border */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-ocean-blue/20 via-coral-bright/40 to-ocean-blue/20
                        flex items-center justify-center text-ocean-blue/80 text-xs">
          𓎢 𓃭 𓅂 𓅱 𓄿 𓎢 𓂋 𓃭 𓅂 𓅱
        </div>
      </div>
    </div>
  );
};

// Pharaonic Card Component
export const PharaohCard = ({ children, className = "", title }: { children: React.ReactNode; className?: string; title?: string }) => {
  return (
    <div className={`relative bg-papyrus/95
                     rounded-2xl border-2 border-ocean-blue/30 shadow-xl shadow-ocean-blue/20
                     backdrop-blur-sm overflow-hidden ${className}`}>
      {/* Golden Corner Decorations */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-ocean-blue/30 to-transparent rounded-br-full"></div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-ocean-blue/30 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-ocean-blue/30 to-transparent rounded-tr-full"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-ocean-blue/30 to-transparent rounded-tl-full"></div>
      
      {/* Hieroglyphic Corner Elements */}
      <div className="absolute top-2 left-2 text-ocean-blue/60 text-xs">𓎢𓃭𓅂𓅱𓄿𓂋𓄿</div>
      
      {/* Title with Hieroglyphic Accent */}
      {title && (
        <div className="p-6 pb-0">
          <h3 className="text-2xl font-heading font-bold text-ocean-blue mb-2 flex items-center gap-3">
            <span className="text-coral-bright">𓎢</span>
            {title}
            <span className="text-coral-bright">𓎢</span>
          </h3>
          <EgyptianBorder className="mb-4" />
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// Floating Egyptian Elements
export const FloatingEgyptianElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle Floating Golden Particles only */}
      <div className="absolute top-16 right-16 w-1 h-1 bg-ocean-blue/30 rounded-full"></div>
      <div className="absolute top-80 left-16 w-1 h-1 bg-ocean-blue/20 rounded-full"></div>
      <div className="absolute bottom-40 right-32 w-1 h-1 bg-ocean-blue/25 rounded-full"></div>
      <div className="absolute bottom-60 left-32 w-1 h-1 bg-ocean-blue/15 rounded-full"></div>
    </div>
  );
};

// Egyptian Pattern Background
export const EgyptianPatternBackground = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 opacity-10 ${className}`}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="egyptian-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Ankh Symbol */}
            <g fill="#0080ff" opacity="0.3">
              <circle cx="60" cy="30" r="12" fill="none" stroke="#0080ff" strokeWidth="3"/>
              <line x1="60" y1="42" x2="60" y2="90" stroke="#0080ff" strokeWidth="3"/>
              <line x1="45" y1="65" x2="75" y2="65" stroke="#0080ff" strokeWidth="3"/>
            </g>
            {/* Eye of Horus */}
            <g fill="#0080ff" opacity="0.2" transform="translate(20, 80)">
              <ellipse cx="20" cy="10" rx="15" ry="8" fill="none" stroke="#0080ff" strokeWidth="2"/>
              <circle cx="20" cy="10" r="3" fill="#0080ff"/>
              <path d="M5 10 Q10 15 15 10" stroke="#0080ff" strokeWidth="2" fill="none"/>
              <path d="M25 10 Q30 15 35 10" stroke="#0080ff" strokeWidth="2" fill="none"/>
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#egyptian-pattern)" />
      </svg>
    </div>
  );
};

// Ancient Egyptian Pharaoh Crown (Pschent - Double Crown)
export const RoyalCrown = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`inline-block ${className}`}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White Crown (Hedjet) - Upper Egypt */}
        <path d="M12 30 Q12 25 15 22 Q20 18 20 15 Q20 18 25 22 Q28 25 28 30 Z"
              fill="url(#pharaoh-white-gradient)" stroke="#0080ff" strokeWidth="1.5"/>

        {/* Red Crown (Deshret) - Lower Egypt */}
        <path d="M8 30 L32 30 L30 25 Q28 22 25 20 L28 18 Q30 16 32 12 L28 14 Q25 16 20 16 Q15 16 12 14 L8 12 Q10 16 12 18 L15 20 Q12 22 10 25 Z"
              fill="url(#pharaoh-red-gradient)" stroke="#B8860B" strokeWidth="1.5"/>

        {/* Uraeus (Serpent) */}
        <path d="M20 12 Q18 10 16 12 Q15 14 17 15 Q19 16 20 14 Q21 12 20 12 Z"
              fill="#3399ff" stroke="#B8860B" strokeWidth="0.8"/>

        {/* Cobra Head */}
        <circle cx="20" cy="10" r="2" fill="#3399ff" stroke="#B8860B" strokeWidth="0.8"/>

        {/* Hieroglyphic Symbols */}
        <text x="10" y="35" fontSize="6" fill="#0080ff" fontFamily="serif">𓎢𓃭𓅂𓅱𓄿𓂋𓄿</text>

        <defs>
          <linearGradient id="pharaoh-white-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFACD"/>
            <stop offset="50%" stopColor="#F5F5DC"/>
            <stop offset="100%" stopColor="#E6E6FA"/>
          </linearGradient>
          <linearGradient id="pharaoh-red-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC143C"/>
            <stop offset="50%" stopColor="#B22222"/>
            <stop offset="100%" stopColor="#8B0000"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Pharaonic Button Component
export const PharaohButton = ({ children, onClick, className = "", variant = "primary" }: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: "primary" | "secondary";
}) => {
  const baseClasses = "relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg";
  
  const variants = {
    primary: "bg-gradient-to-r from-ocean-blue via-blue-500 to-ocean-blue text-white shadow-ocean-blue/50 hover:shadow-ocean-blue/70",
    secondary: "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-blue-500/50 hover:shadow-blue-500/70"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {/* Hieroglyphic Decorations - Removed black symbols */}
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
};

// Hieroglyphic Divider
export const HieroglyphicDivider = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center my-8 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-coral-bright/50 to-ocean-blue/50"></div>
      <div className="px-6 text-ocean-blue text-2xl">
        𓎢𓃭𓅂𓅱𓄿𓂋𓄿
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-coral-bright/50 to-ocean-blue/50"></div>
    </div>
  );
};

// Emerald/Jade themed variants for Packages page
export const EmeraldCard = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div
    className={`bg-white/95 backdrop-blur-sm border-2 border-emerald-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-300/70 relative overflow-hidden ${className}`}
    {...props}
  >
    {/* Emerald corner decorations */}
    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-emerald-400/60 rounded-tl-2xl"></div>
    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-jade-400/60 rounded-br-2xl"></div>
    {children}
  </div>
);

export const EmeraldButton = ({ children, className = "", variant = "primary", ...props }: { children: React.ReactNode; className?: string; variant?: "primary" | "secondary"; [key: string]: any }) => {
  const baseClasses = "inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden";
  const primaryClasses = "bg-white via-jade-500 to-emerald-600 text-black hover:from-jade-600 hover:via-emerald-500 hover:to-jade-600 shadow-emerald-300/50";
  const secondaryClasses = "bg-gradient-to-r from-white via-emerald-50 to-white text-black border-2 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50";

  return (
    <button
      className={`${baseClasses} ${variant === "primary" ? primaryClasses : secondaryClasses} ${className}`}
      {...props}
    >
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </button>
  );
};

export const EmeraldBorder = ({ className = "" }: { className?: string }) => (
  <div className={`h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full ${className}`}>
    <div className="h-full bg-white via-jade-400 to-emerald-300 rounded-full animate-pulse"></div>
  </div>
);

export const EmeraldObelisk = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative ${className}`}>
    {/* Obelisk shape with emerald theme */}
    <div className="bg-white via-jade-50 to-emerald-100 border-2 border-emerald-300/50 rounded-t-3xl rounded-b-lg p-8 relative overflow-hidden">
      {/* Emerald hieroglyphic decorations - Removed black symbols */}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Emerald pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-white"></div>
      </div>
    </div>

    {/* Obelisk base */}
    <div className="w-full h-4 bg-white via-jade-500 to-emerald-400 rounded-b-lg border-2 border-t-0 border-emerald-300/50"></div>
  </div>
);

export const FloatingEmeraldElements = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
    {/* Floating emerald hieroglyphs - Removed black symbols */}

    {/* Floating emerald particles */}
    <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
    <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-jade-400 rounded-full animate-ping"></div>
    <div className="absolute top-2/3 right-2/3 w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></div>
  </div>
);

export const EmeraldPatternBackground = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 ${className}`}>
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="emerald-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="2" fill="currentColor" className="text-ocean-blue/20" />
          <path d="M5,5 L15,15 M15,5 L5,15" stroke="currentColor" strokeWidth="0.5" className="text-emerald-600/20" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#emerald-pattern)" />
    </svg>
  </div>
);

export const EmeraldHieroglyphicDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center py-16 ${className}`}>
    <div className="flex items-center gap-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-emerald-300"></div>
      <div className="flex items-center gap-4">
        {/* Removed black hieroglyphic symbols */}
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-jade-300"></div>
    </div>
  </div>
);

export const EmeraldCrown = ({ className = "" }: { className?: string }) => (
  <div className={`relative inline-block ${className}`}>
    <svg width="80" height="60" viewBox="0 0 80 60" className="text-text-primary">
      {/* Atef Crown - Feathered Crown of Osiris */}
      <path
        d="M25 50 Q25 45 30 40 Q40 30 40 25 Q40 30 50 40 Q55 45 55 50 Z"
        fill="currentColor"
        className="drop-shadow-lg text-text-primary"
      />

      {/* Ostrich Feathers */}
      <path d="M20 45 Q18 35 22 30 Q25 35 23 45" fill="currentColor" className="text-ocean-blue" />
      <path d="M57 45 Q62 35 58 30 Q55 35 57 45" fill="currentColor" className="text-ocean-blue" />

      {/* Central Uraeus */}
      <circle cx="40" cy="25" r="4" fill="currentColor" className="text-emerald-600" />

      {/* Side Uraei */}
      <circle cx="28" cy="35" r="2.5" fill="currentColor" className="text-ocean-blue" />
      <circle cx="52" cy="35" r="2.5" fill="currentColor" className="text-ocean-blue" />

      {/* Hieroglyphic Elements - Removed black symbols */}
    </svg>
    <div className="absolute inset-0 animate-pulse">
      <div className="w-full h-full bg-white to-transparent rounded-full"></div>
    </div>
  </div>
);

// Pharaonic Components - More Royal
export const PharaonicCard = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div
    className={`relative bg-white/95
                 rounded-2xl border-2 border-ocean-blue/40 shadow-2xl shadow-ocean-blue/20
                 backdrop-blur-sm hover:shadow-ocean-blue/30 hover:border-ocean-blue/60
                 transition-all duration-500 overflow-hidden group ${className}`}
    {...props}
  >
    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">{children}</div>
    {/* corner ornaments */}
    <div className="absolute top-2 left-2 text-ocean-blue/30 text-sm">𓇳</div>
    <div className="absolute top-2 right-2 text-ocean-blue/30 text-sm">𓊪</div>
    <div className="absolute bottom-2 left-2 text-ocean-blue/30 text-sm">𓈖</div>
    <div className="absolute bottom-2 right-2 text-ocean-blue/30 text-sm">𓂀</div>
  </div>
);

export const PharaonicButton = ({ children, className = "", variant = "primary", ...props }: { children: React.ReactNode; className?: string; variant?: "primary" | "secondary"; [key: string]: any }) => {
  const baseClasses = "inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden";

  const variants = {
    primary: "bg-gradient-to-r from-ocean-blue via-blue-500 to-ocean-blue text-white shadow-lg shadow-ocean-blue/30 hover:shadow-ocean-blue/50 border-2 border-ocean-blue/50",
    secondary: "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 border-2 border-blue-500/50"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </button>
  );
};

export const PharaonicBorder = ({ className = "" }: { className?: string }) => (
  <div className={`h-1 bg-gradient-to-r from-transparent via-coral-bright to-transparent rounded-full ${className}`}>
    <div className="h-full bg-gradient-to-r from-ocean-blue/50 via-coral-bright to-ocean-blue/50 rounded-full animate-pulse" />
  </div>
);

export const PharaonicObelisk = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="bg-gradient-to-b from-ocean-blue/20 via-coral-bright/10 to-ocean-blue/20
                    border-4 border-ocean-blue/40 rounded-t-3xl rounded-b-lg
                    shadow-2xl shadow-ocean-blue/30 backdrop-blur-sm bg-white/95
                    transform hover:scale-105 transition-all duration-500
                    relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-coral-bright/5 to-transparent" />

      {/* Hieroglyphic borders */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-ocean-blue text-2xl">𓎢</div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-ocean-blue text-2xl">𓃭</div>

      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  </div>
);

export const FloatingPharaonicElements = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
    {/* Subtle decorative particles only */}
    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-ocean-blue/20 rounded-full"></div>
    <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-ocean-blue/15 rounded-full"></div>
    <div className="absolute bottom-1/4 left-3/4 w-1 h-1 bg-ocean-blue/20 rounded-full"></div>
    <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-ocean-blue/10 rounded-full"></div>
  </div>
);

export const PharaonicPatternBackground = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 ${className}`}>
    <div className="absolute inset-0 bg-white" />
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 w-full h-full bg-repeat"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
             backgroundSize: '60px 60px'
           }} />
    </div>
  </div>
);

export const PharaonicCrown = ({ className = "" }: { className?: string }) => (
  <div className={`relative inline-block ${className}`}>
    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-ocean-blue/40">
      {/* Khepresh - Blue War Crown of Pharaohs */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main Crown Body */}
        <path d="M8 30 Q8 20 12 15 Q20 8 20 8 Q20 8 28 15 Q32 20 32 30 Z"
              fill="url(#khepresh-gradient)" stroke="#0080ff" strokeWidth="1.5"/>

        {/* Golden Dots Pattern */}
        <circle cx="15" cy="18" r="1" fill="#3399ff"/>
        <circle cx="20" cy="15" r="1" fill="#3399ff"/>
        <circle cx="25" cy="18" r="1" fill="#3399ff"/>
        <circle cx="18" cy="22" r="1" fill="#3399ff"/>
        <circle cx="22" cy="22" r="1" fill="#3399ff"/>
        <circle cx="20" cy="26" r="1" fill="#3399ff"/>

        {/* Uraeus Serpent */}
        <path d="M20 8 Q18 6 16 8 Q15 10 17 11 Q19 12 20 10 Q21 8 20 8 Z"
              fill="#3399ff" stroke="#B8860B" strokeWidth="0.8"/>

        <defs>
          <linearGradient id="khepresh-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A"/>
            <stop offset="50%" stopColor="#FFBF00"/>
            <stop offset="100%" stopColor="#0080ff"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-ocean-blue to-blue-600 rounded-full flex items-center justify-center shadow-lg">
      <span className="text-gold-text-dark text-sm font-bold">𓇳</span>
    </div>
    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-white0 to-ocean-blue rounded-full flex items-center justify-center shadow-lg">
      <span className="text-gold-text-dark text-sm font-bold">𓊪</span>
    </div>
    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gradient-to-br from-ocean-blue to-blue-500 rounded-full flex items-center justify-center shadow-md">
      <span className="text-gold-text-dark text-xs font-bold">𓈖</span>
    </div>
    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gradient-to-br from-white0 to-ocean-blue rounded-full flex items-center justify-center shadow-md">
      <span className="text-gold-text-dark text-xs font-bold">𓂀</span>
    </div>
  </div>
);

// Pharaoh Crown Hieroglyph - Can be used as text replacement
export const PharaohCrownSymbol = ({ className = "", size = "1em" }: { className?: string; size?: string }) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size }}>
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Simplified Pharaoh Crown for text use */}
      <path d="M5 18 Q5 14 8 12 Q12 9 12 9 Q12 9 16 12 Q19 14 19 18 Z"
            fill="currentColor"/>

      {/* Uraeus */}
      <circle cx="12" cy="9" r="1.5" fill="currentColor"/>

      {/* Side decorations */}
      <circle cx="8" cy="15" r="0.8" fill="currentColor" opacity="0.8"/>
      <circle cx="16" cy="15" r="0.8" fill="currentColor" opacity="0.8"/>
    </svg>
  </span>
);

// Hieroglyphic "Egypt" Component - Single unified text
export const EgyptHieroglyphic = ({ className = "", size = "2rem" }: { className?: string; size?: string }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ fontSize: size }}>
    <span className="text-ocean-blue animate-pulse">𓎢𓃭𓅂𓅱𓄿𓂋𓄿</span>
  </div>
);

// Alternative Egypt Hieroglyphic - Same unified text
export const EgyptHieroglyphicAlt = ({ className = "", size = "2rem" }: { className?: string; size?: string }) => (
  <div className={`inline-flex items-center justify-center ${className}`} style={{ fontSize: size }}>
    <span className="text-ocean-blue animate-pulse">𓎢𓃭𓅂𓅱𓄿𓂋𓄿</span>
  </div>
);



// Additional Egyptian Crown Symbols for variety
export const EGYPTIAN_CROWN_SYMBOLS = {
  // Pschent (Double Crown) - 𓋖
  pschent: '𓋖',
  // Hedjet (White Crown) - 𓋗
  hedjet: '𓋗',
  // Deshret (Red Crown) - 𓋖
  deshret: '𓋖',
  // Khepresh (Blue Crown) - 𓋘
  khepresh: '𓋘',
  // Atef Crown - 𓋙
  atef: '𓋙',
  // Nemes Headdress - 𓋚
  nemes: '𓋚'
};
