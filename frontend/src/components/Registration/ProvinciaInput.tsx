// src/components/Registration/ProvinciaInput.tsx
import React, { useState } from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useProvinciasLocal, type Province } from '@/hooks/useProvinciasLocal';

interface ProvinciaInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  pais: string; // ISO2 del país
  touched?: boolean;
  loading?: boolean;
}

const ProvinciaInput: React.FC<ProvinciaInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  pais,
  touched,
  loading = false,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { provincias, loading: provinciasLoading } = useProvinciasLocal(pais);

  const handleChange = (_: unknown, newValue: Province | null) => {
    if (newValue) {
      const syntheticEvent = {
        target: { name: 'provincia', value: newValue.name }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const handleBlur = () => {
    const syntheticEvent = {
      target: { value }
    } as React.FocusEvent<HTMLInputElement>;
    onBlur(syntheticEvent);
  };

  const getHelperText = () => {
    if (provinciasLoading) {
      return 'Cargando provincias...';
    }
    if (!pais) {
      return 'Selecciona un país primero';
    }
    if (provincias.length === 0) {
      return 'No hay provincias disponibles';
    }
    return helperText || '';
  };

  const getEndAdornment = () => {
    if (provinciasLoading || loading) {
      return <CircularProgress size={20} />;
    }
    if (error && touched) {
      return <ErrorOutlineIcon color="error" />;
    }
    if (!error && touched && value) {
      return <CheckCircleIcon color="success" />;
    }
    return null;
  };

  return (
    <Autocomplete
      options={provincias}
      getOptionLabel={(option) => option.name}
      value={provincias.find((p: Province) => p.name === value) || null}
      onChange={handleChange}
      onBlur={handleBlur}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      loading={provinciasLoading || loading}
      open={open}
      disabled={!pais || provinciasLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Provincia"
          required
          error={error}
          helperText={getHelperText()}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {getEndAdornment()}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default ProvinciaInput;
