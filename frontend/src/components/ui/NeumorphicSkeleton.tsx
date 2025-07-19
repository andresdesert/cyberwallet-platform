import React, { useEffect } from 'react';
import { Skeleton, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import log from 'loglevel';

interface NeumorphicSkeletonProps {
  variant: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | false;
  sx?: object;
  count?: number;
  ariaLabel?: string;
}

const NeumorphicSkeleton: React.FC<NeumorphicSkeletonProps> = ({
  variant,
  width,
  height,
  animation = 'wave',
  sx = {},
  count = 1,
  ariaLabel = 'Cargando...',
}) => {
  const theme = useTheme();

  // Log render con props relevantes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      log.debug(`[DEV][NeumorphicSkeleton] Render → variant: ${variant}, width: ${width}, height: ${height}, count: ${count}, animation: ${animation}`);
    }
  }, [variant, width, height, animation, count]);

  const safeCount = Math.max(1, count);

  const shadowDark = alpha(theme.palette?.custom?.neumoDarkShadow || '#000', 0.4);
  const shadowLight = alpha(theme.palette?.custom?.neumoLightShadow || '#fff', 0.5);

  const baseStyle = {
    backgroundColor: theme.palette.custom?.neumoSurface || theme.palette.background.paper,
    borderRadius: variant === 'circular' ? '50%' : '12px',
    boxShadow: `2px 2px 5px ${shadowDark}, -2px -2px 5px ${shadowLight}`,
    transition: 'all 0.3s ease-in-out',
    '&::after': {
      background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.text.primary, 0.1)}, transparent)`,
    },
    ...sx,
  };

  const skeletons = Array.from({ length: safeCount }).map((_, index) => (
    <Skeleton
      key={index}
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      sx={baseStyle}
      role="status"
      aria-label={ariaLabel}
    />
  ));

  return safeCount > 1 ? (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {skeletons}
    </Box>
  ) : (
    skeletons[0]
  );
};

export default NeumorphicSkeleton;
