// src/components/Registration/PaisInput.tsx
import React, { useState } from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Pais {
  nombre: string; // Ej: "Argentina"
  iso2: string;   // Ej: "AR"
}

interface PaisInputProps {
  value: string; // ISO2 guardado en form.pais
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  touched?: boolean;
  opciones: Pais[];
  loading?: boolean;
}

const PaisInput: React.FC<PaisInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  opciones,
  touched,
  loading = false,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const getOptionLabel = (option: any) => {
    return option?.name || '';
  };

  const handleChange = (_: unknown, newValue: any) => {
    if (newValue) {
      const syntheticEvent = {
        target: { name: 'pais', value: newValue.iso2 }
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

  const getEndAdornment = () => {
    if (loading) {
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

  const selectedPais = opciones.find(pais => pais.iso2 === value);

  return (
    <Autocomplete
      options={opciones}
      getOptionLabel={(option) => option.nombre}
      value={selectedPais || null}
      onChange={handleChange}
      onBlur={handleBlur}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      loading={loading}
      open={open}
      renderInput={(params) => (
        <TextField
          {...params}
          label="País"
          required
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
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

export default PaisInput;
