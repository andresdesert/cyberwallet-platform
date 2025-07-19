import React from 'react';

const CyberWalletLogo: React.FC<{ size?: number | string; animated?: boolean }> = ({ size = 48, animated = true }) => {
  // Convertir string a número si es necesario
  const sizeValue = typeof size === 'string' 
    ? size === 'small' ? 32 : size === 'medium' ? 48 : size === 'large' ? 64 : 48
    : size;

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 8,
      // 🎯 CRÍTICO: Asegurar visibilidad del logo
      position: 'relative',
      zIndex: 10,
      filter: 'drop-shadow(0 4px 20px rgba(127, 0, 255, 0.3))',
    }}>
      <svg
        width={sizeValue}
        height={sizeValue}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 2px 12px #7F00FF44)',
          transition: 'filter 0.3s',
          cursor: 'pointer',
          // 🎯 CRÍTICO: Asegurar que el SVG sea visible
          position: 'relative',
          zIndex: 1,
        }}
        className={animated ? 'cyberwallet-logo-animated' : ''}
      >
        <defs>
          <linearGradient id="cw-gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7F00FF" />
            <stop offset="0.5" stopColor="#0E7AFF" />
            <stop offset="1" stopColor="#3BFFAA" />
          </linearGradient>
        </defs>
        {/* C abierta, con efecto glass y gradiente */}
        <path
          d="M52 32C52 44.1503 44.1503 52 32 52C19.8497 52 12 44.1503 12 32C12 19.8497 19.8497 12 32 12C37.5228 12 42.5228 14.2386 46.1421 18.1421"
          stroke="url(#cw-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 8px #7F00FF66)' }}
        />
        {/* Brillo animado */}
        <circle
          cx="46"
          cy="18"
          r="3.5"
          fill="#3BFFAA"
          opacity="0.8"
        >
          {animated && <animate attributeName="r" values="3.5;5;3.5" dur="1.2s" repeatCount="indefinite" />}
        </circle>
      </svg>
      
      <span
        style={{
          fontFamily: 'Plus Jakarta Sans, Satoshi, Clash Display, Arial, sans-serif',
          fontWeight: 700,
          fontSize: sizeValue * 0.38,
          letterSpacing: '0.01em',
          background: 'linear-gradient(90deg, #7F00FF 0%, #0E7AFF 60%, #3BFFAA 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          lineHeight: 1,
          // 🎯 CRÍTICO: Asegurar que el texto sea visible
          position: 'relative',
          zIndex: 1,
          textShadow: '0 2px 4px rgba(127, 0, 255, 0.3)',
        }}
      >
        Cyber<wbr />wallet
      </span>
    </div>
  );
};

export default CyberWalletLogo; 