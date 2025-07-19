import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useUnifiedTheme } from '@/context/UnifiedThemeContext';
import { usePreferences } from '@/context/Settings/PreferencesContext';
import log from 'loglevel';
import { motion } from 'motion/react';
import { useCotizaciones } from '@/hooks/useCotizaciones';
import { useTranslation } from 'react-i18next';
import { 
  Palette as PaletteIcon, 
  Language as LanguageIcon, 
  AttachMoney as MoneyIcon,
  Accessibility as AccessibilityIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  VisibilityOff as ComfortIcon,
} from '@mui/icons-material';

const PreferencesSection: React.FC = () => {
  const { t } = useTranslation(['preferences', 'landing']);
      const { colorScheme, toggleColorScheme } = useUnifiedTheme();
  const { language, setLanguage, showInUSD, toggleCurrencyDisplay } = usePreferences();
  const { cotizaciones } = useCotizaciones();
  const theme = useTheme();
  const rate = cotizaciones[0]?.venta ?? null;

  const handleThemeChange = (event: SelectChangeEvent) => {
    const newMode = event.target.value as typeof colorScheme;
    if (newMode !== colorScheme) {
      toggleColorScheme();
      log.info(`[INFO][Preferences] Tema cambiado a: ${newMode}`);
    }
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    const newLang = event.target.value as typeof language;
    setLanguage(newLang);
    log.info(`[INFO][Preferences] Idioma cambiado a: ${newLang}`);
  };

  const handleCurrencyToggle = () => {
    toggleCurrencyDisplay();
    log.info(`[INFO][Preferences] Mostrar saldos en ${showInUSD ? 'ARS' : 'USD'}`);
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 20,
        delay: 0.1 
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
          backdropFilter: 'blur(20px)',
          transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.standard,
          }),
          '&:hover': {
            transform: 'translateY(-2px)',
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
          },
        }}
      >
        {/* Header con icono */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PaletteIcon 
            sx={{ 
              mr: 2, 
              color: theme.palette.primary.main,
              fontSize: '1.5rem'
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('preferences:title', 'Preferencias')}
          </Typography>
        </Box>

        {/* Selector de Tema */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  {colorScheme === 'dark' ? (
                <DarkModeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              ) : (
                <LightModeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              )}
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                {t('preferences:theme', 'Tema')}
              </Typography>
            </Box>
            
            <FormControl fullWidth size="small">
              <InputLabel>{t('preferences:selectTheme', 'Seleccionar tema')}</InputLabel>
              <Select
                                    value={colorScheme}
                label={t('preferences:selectTheme', 'Seleccionar tema')}
                onChange={handleThemeChange}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.divider,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <MenuItem value="light">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LightModeIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                    {t('preferences:lightMode', 'Modo Claro')}
                  </Box>
                </MenuItem>
                <MenuItem value="dark">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DarkModeIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                    {t('preferences:darkMode', 'Modo Oscuro')}
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </motion.div>

        <Divider sx={{ my: 2, opacity: 0.3 }} />

        {/* Selector de Idioma */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LanguageIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                {t('preferences:language', 'Idioma')}
              </Typography>
            </Box>
            
            <FormControl fullWidth size="small">
              <InputLabel>{t('preferences:selectLanguage', 'Seleccionar idioma')}</InputLabel>
              <Select
                value={language}
                label={t('preferences:selectLanguage', 'Seleccionar idioma')}
                onChange={handleLanguageChange}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.divider,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <MenuItem value="es">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 15,
                        mr: 1,
                        borderRadius: 0.5,
                        background: 'linear-gradient(to bottom, #c60b1e 33%, #ffc400 33%, #ffc400 66%, #c60b1e 66%)',
                      }}
                    />
                    Español
                  </Box>
                </MenuItem>
                <MenuItem value="en">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 15,
                        mr: 1,
                        borderRadius: 0.5,
                        background: 'linear-gradient(to bottom, #012169 33%, #ffffff 33%, #ffffff 66%, #c8102e 66%)',
                      }}
                    />
                    English
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </motion.div>

        <Divider sx={{ my: 2, opacity: 0.3 }} />

        {/* Selector de Moneda */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={showInUSD}
                  onChange={handleCurrencyToggle}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MoneyIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {t('preferences:showInUSD', 'Mostrar saldos en USD')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {rate ? (
                        `${t('preferences:currentRate', 'Cotización actual')}: $${rate} ARS`
                      ) : (
                        t('preferences:loadingRate', 'Cargando cotización...')
                      )}
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }}
            />
            {showInUSD && (
              <Chip
                icon={<MoneyIcon />}
                label="USD"
                size="small"
                color="secondary"
                variant="outlined"
                sx={{ mt: 1, ml: 4 }}
              />
            )}
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default PreferencesSection;