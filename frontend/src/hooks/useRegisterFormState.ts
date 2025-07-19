// src/hooks/useRegisterFormState.ts
import React, { useState, useContext, createContext, ReactNode, useMemo, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import log from 'loglevel';

import { getLocationIds } from '@/api/mapping';
import { register, RegisterResponse } from '@/api/auth';
import { checkEmailAvailability, checkUsernameAvailability } from '@/api/checkAvailability';
import { useDebounce } from './useDebounce';

interface FormState {
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fechaNacimiento: string;
  dni: string;
  genero: string;
  telefono: string;
  calle: string;
  numero: number; // Cambiado de number | null a number para consistencia con backend
  provincia: string;
  pais: string;
}

const isFormField = (key: string): key is keyof FormState => {
  return ['nombre', 'apellido', 'username', 'email', 'password', 'confirmPassword', 'fechaNacimiento', 'dni', 'genero', 'telefono', 'calle', 'numero', 'provincia', 'pais'].includes(key);
};

const useRegisterFormState = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fechaNacimiento: '',
    dni: '',
    genero: '',
    telefono: '',
    calle: '',
    numero: 0,
    provincia: '',
    pais: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [availability, setAvailability] = useState<Record<string, boolean | undefined>>({});
  const [loadingChecks, setLoadingChecks] = useState<Record<string, boolean>>({});

  // Debounce para email y username para evitar múltiples llamadas a la API
  const debouncedEmail = useDebounce(form.email, 500);
  const debouncedUsername = useDebounce(form.username, 500);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleCloseSnackbar = () => {
    // Implementar lógica para cerrar snackbar si es necesario
  };

  const handleChangeEvent = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (isFormField(name)) {
      // Validación para nombre y apellido - solo letras y espacios
      if ((name === 'nombre' || name === 'apellido') && value !== '') {
        const onlyLettersAndSpaces = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]*$/;
        if (!onlyLettersAndSpaces.test(value)) {
          return;
        }
      }

      // Validación DNI - solo números, máximo 8 dígitos
      if (name === 'dni') {
        const onlyNumbers = /^\d*$/;
        if (!onlyNumbers.test(value)) {
          return;
        }
        if (value.length > 8) {
          return;
        }
        if (value.length === 8 && value.startsWith('0')) {
          return;
        }
      }

      // Validación teléfono - exactamente 10 dígitos, no empezar con 0 ni 15
      if (name === 'telefono') {
        const onlyNumbers = /^\d*$/;
        if (!onlyNumbers.test(value)) {
          return;
        }
        if (value.length > 10) {
          return;
        }
        if (value.startsWith('0') || value.startsWith('15')) {
          return;
        }
      }
      
      // Validación para campos de dirección
      if (name === 'numero') {
        const onlyNumbers = /^\d*$/;
        if (!onlyNumbers.test(value)) {
          return;
        }
        const numValue = parseInt(value);
        if (value !== '' && (numValue < 1 || numValue > 9999)) {
          return;
        }
      }
      
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleChange = (field: string, value: string | number) => {
    if (isFormField(field)) {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    }
  };

  const handleBlur = async (field: string) => {
    log.info(`[RegisterForm] 🔍 Validando campo: ${field}`);
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Validar formato del campo primero
    if (isFormField(field)) {
      const validationError = validateField(field as keyof FormState);
      setErrors((prev) => ({ ...prev, [field]: validationError }));
      
      // Si hay error de formato, no continuar con validaciones de disponibilidad
      if (validationError) {
        log.info(`[RegisterForm] ❌ Error de formato en ${field}: ${validationError}`);
        return;
      }
    }
    
    // Validar disponibilidad solo para email y username cuando el formato es correcto
    if (field === 'email' && debouncedEmail.trim()) {
      log.info(`[RegisterForm] 📧 Verificando disponibilidad de email: ${debouncedEmail}`);
      try {
        setLoadingChecks((prev) => ({ ...prev, email: true }));
        const isAvailable = await checkEmailAvailability(debouncedEmail.trim());
        
        if (!isAvailable) {
          setErrors((prev) => ({ ...prev, email: 'Este email ya está registrado' }));
          setAvailability((prev) => ({ ...prev, email: false }));
          log.warn(`[RegisterForm] ❌ Email no disponible: ${debouncedEmail}`);
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.email;
            return newErrors;
          });
          setAvailability((prev) => ({ ...prev, email: true }));
          log.info(`[RegisterForm] ✅ Email disponible: ${debouncedEmail}`);
        }
      } catch (error) {
        log.error('[RegisterForm] ❌ Error verificando email:', error);
        setErrors((prev) => ({ ...prev, email: 'Error al verificar disponibilidad del email' }));
        setAvailability((prev) => ({ ...prev, email: false }));
      } finally {
        setLoadingChecks((prev) => ({ ...prev, email: false }));
      }
    }
    
    if (field === 'username' && debouncedUsername.trim()) {
      log.info(`[RegisterForm] 👤 Verificando disponibilidad de username: ${debouncedUsername}`);
      try {
        setLoadingChecks((prev) => ({ ...prev, username: true }));
        const isAvailable = await checkUsernameAvailability(debouncedUsername.trim());
        
        if (!isAvailable) {
          setErrors((prev) => ({ ...prev, username: 'Este nombre de usuario ya está en uso' }));
          setAvailability((prev) => ({ ...prev, username: false }));
          log.warn(`[RegisterForm] ❌ Username no disponible: ${debouncedUsername}`);
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.username;
            return newErrors;
          });
          setAvailability((prev) => ({ ...prev, username: true }));
          log.info(`[RegisterForm] ✅ Username disponible: ${debouncedUsername}`);
        }
      } catch (error) {
        log.error('[RegisterForm] ❌ Error verificando username:', error);
        setErrors((prev) => ({ ...prev, username: 'Error al verificar disponibilidad del username' }));
        setAvailability((prev) => ({ ...prev, username: false }));
      } finally {
        setLoadingChecks((prev) => ({ ...prev, username: false }));
      }
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const validateField = (field: keyof FormState) => {
    const value = form[field];
    let error = '';

    switch (field) {
      case 'nombre':
        if (!String(value).trim()) {
          error = 'El nombre es obligatorio';
        } else if (String(value).length < 2) {
          error = 'El nombre debe tener al menos 2 caracteres';
        } else if (String(value).length > 30) {
          error = 'El nombre no puede tener más de 30 caracteres';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ'\\-\\s]{2,30}$/.test(String(value))) {
          error = 'El nombre contiene caracteres no permitidos';
        }
        break;

      case 'apellido':
        if (!String(value).trim()) {
          error = 'El apellido es obligatorio';
        } else if (String(value).length < 2) {
          error = 'El apellido debe tener al menos 2 caracteres';
        } else if (String(value).length > 40) {
          error = 'El apellido no puede tener más de 40 caracteres';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ'\\-\\s]{2,40}$/.test(String(value))) {
          error = 'El apellido contiene caracteres no permitidos';
        }
        break;

      case 'username':
        if (!String(value).trim()) {
          error = 'El nombre de usuario es obligatorio';
        } else if (String(value).length < 4) {
          error = 'El nombre de usuario debe tener al menos 4 caracteres';
        } else if (String(value).length > 20) {
          error = 'El nombre de usuario no puede tener más de 20 caracteres';
        } else if (!/^[a-zA-Z0-9_\\-\\.]+$/.test(String(value))) {
          error = 'El nombre de usuario contiene caracteres no permitidos';
        }
        break;

      case 'email':
        if (!String(value).trim()) {
          error = 'El email es obligatorio';
        } else if (String(value).length < 5) {
          error = 'El email debe tener al menos 5 caracteres';
        } else if (String(value).length > 100) {
          error = 'El email no puede tener más de 100 caracteres';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
          error = 'El email no tiene un formato válido';
        }
        break;

      case 'password':
        if (!String(value).trim()) {
          error = 'La contraseña es obligatoria';
        } else if (String(value).length < 8) {
          error = 'La contraseña debe tener al menos 8 caracteres';
        } else if (String(value).length > 64) {
          error = 'La contraseña no puede tener más de 64 caracteres';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).+$/.test(String(value))) {
          error = 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial';
        }
        break;

      case 'confirmPassword':
        if (!String(value).trim()) {
          error = 'La confirmación de contraseña es obligatoria';
        } else if (String(value) !== form.password) {
          error = 'Las contraseñas no coinciden';
        }
        break;

      case 'fechaNacimiento':
        if (!value) {
          error = 'La fecha de nacimiento es obligatoria';
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
          error = 'La fecha de nacimiento debe tener el formato AAAA-MM-DD';
        } else {
          const age = calculateAge(String(value));
          if (age < 18) {
            error = 'Debes ser mayor de 18 años';
          } else if (age > 120) {
            error = 'La fecha de nacimiento no es válida';
          }
        }
        break;

      case 'dni':
        if (!String(value).trim()) {
          error = 'El DNI es obligatorio';
        } else {
          const dniClean = String(value).replace(/\D/g, '');
          if (!/^(?!0)[0-9]{7,8}$/.test(dniClean)) {
            error = 'El DNI debe tener exactamente 7 u 8 dígitos, no puede comenzar con cero si tiene 8 dígitos';
          }
        }
        break;

      case 'genero':
        if (!value) {
          error = 'Selecciona tu género';
        } else if (!/^(Masculino|Femenino|Otro|Prefiero no decirlo)$/i.test(String(value))) {
          error = 'El género debe ser válido';
        }
        break;

      case 'telefono':
        if (!String(value).trim()) {
          error = 'El teléfono es obligatorio';
        } else {
          const telefonoClean = String(value).replace(/\D/g, '');
          if (!/^(?!0)(?!15)\d{10}$/.test(telefonoClean)) {
            error = 'El teléfono debe tener exactamente 10 dígitos, no comenzar con 0 ni 15';
          }
        }
        break;

      case 'calle':
        if (!String(value).trim()) {
          error = 'La calle es obligatoria';
        } else if (String(value).length < 3) {
          error = 'La calle debe tener al menos 3 caracteres';
        } else if (String(value).length > 100) {
          error = 'La calle no puede tener más de 100 caracteres';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9'\-\.\s#°ªº,]+$/.test(String(value))) {
          error = 'La calle debe contener solo letras, números, espacios y caracteres válidos (-, ., #, °, ª, º, ,)';
        }
        break;

      case 'numero':
        if (!value || value === 0) {
          error = 'El número es obligatorio';
        } else if (typeof value === 'number' && (value < 1 || value > 9999)) {
          error = 'El número debe estar entre 1 y 9999';
        }
        break;

      case 'provincia':
        if (!value) {
          error = 'Selecciona tu provincia';
        }
        break;

      case 'pais':
        if (!value) {
          error = 'Selecciona tu país';
        }
        break;
    }

    return error;
  };

  const validateStep = (step: number): boolean => {
    const stepFields: Record<number, (keyof FormState)[]> = {
      1: ['nombre', 'apellido', 'username', 'email', 'password', 'confirmPassword'],
      2: ['fechaNacimiento', 'dni', 'genero'],
      3: ['telefono', 'calle', 'numero', 'provincia', 'pais'],
    };

    const fieldsToValidate = stepFields[step] || [];
    const newErrors: Record<string, string> = {};

    fieldsToValidate.forEach((field) => {
      const error = validateField(field);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1);
        log.info(`[RegisterForm] Avanzando al paso ${currentStep + 1}`);
      } else {
        handleSubmit();
      }
    } else {
      enqueueSnackbar('Por favor, corrige los errores antes de continuar', {
        variant: 'error',
      });
      log.warn('[RegisterForm] Errores de validación en el paso', currentStep);
    }
  };

  const handleBack = () => {
    console.log('🔙 [handleBack] Función llamada, currentStep actual:', currentStep);
    console.log('🔙 [handleBack] Tipo de currentStep:', typeof currentStep);
    console.log('🔙 [handleBack] currentStep > 1:', currentStep > 1);
    
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      console.log('🔙 [handleBack] Calculando nuevo paso:', newStep);
      setCurrentStep(newStep);
      console.log('🔙 [handleBack] Cambiando a paso:', newStep);
      log.info(`[RegisterForm] Retrocediendo al paso ${newStep}`);
    } else {
      console.log('🔙 [handleBack] No se puede retroceder, ya estamos en el paso 1');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    log.info('[RegisterForm] 🚀 Iniciando proceso de registro...');
    log.info('[RegisterForm] Estado actual del formulario:', form);

    if (!validateStep(3)) {
      log.error('[RegisterForm] ❌ Validación del paso 3 falló');
      enqueueSnackbar('Por favor, corrige todos los errores antes de enviar', {
        variant: 'error',
      });
      return;
    }

    log.info('[RegisterForm] ✅ Validación del paso 3 exitosa');
    setLoading(true);

    try {
      // Validar disponibilidad de email y username
      log.info('[RegisterForm] 🔍 Verificando disponibilidad de email y username...');
      const [emailAvailable, usernameAvailable] = await Promise.all([
        checkEmailAvailability(form.email),
        checkUsernameAvailability(form.username),
      ]);

      log.info('[RegisterForm] Resultados de disponibilidad:', { emailAvailable, usernameAvailable });

      if (!emailAvailable) {
        log.error('[RegisterForm] ❌ Email no disponible:', form.email);
        setErrors((prev) => ({ ...prev, email: 'Este email ya está registrado' }));
        enqueueSnackbar('Este email ya está registrado', { variant: 'error' });
        setLoading(false);
        return;
      }

      if (!usernameAvailable) {
        log.error('[RegisterForm] ❌ Username no disponible:', form.username);
        setErrors((prev) => ({ ...prev, username: 'Este nombre de usuario ya está en uso' }));
        enqueueSnackbar('Este nombre de usuario ya está en uso', { variant: 'error' });
        setLoading(false);
        return;
      }

      log.info('[RegisterForm] ✅ Email y username disponibles');

      // 🎯 Obtener IDs reales de país y provincia
      log.info('[RegisterForm] 🗺️ Mapeando ubicación a IDs:', { pais: form.pais, provincia: form.provincia });
      const locationIds = await getLocationIds(form.pais, form.provincia);
      
      log.info('[RegisterForm] Resultado del mapeo de ubicación:', locationIds);
      
      if (!locationIds) {
        const errorMsg = 'No se pudo obtener la información de ubicación. Por favor, verifica el país y provincia seleccionados.';
        log.error('[RegisterForm] ❌ Error en mapeo de ubicación - locationIds es null');
        setErrors((prev) => ({ 
          ...prev, 
          pais: 'País inválido',
          provincia: 'Provincia inválida para el país seleccionado'
        }));
        enqueueSnackbar(errorMsg, { variant: 'error' });
        setLoading(false);
        return;
      }

      log.info('[RegisterForm] ✅ Mapeo de ubicación exitoso:', locationIds);

      // Preparar datos para el registro con IDs correctos
      const registrationData = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.username.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        fechaNacimiento: form.fechaNacimiento,
        dni: form.dni.replace(/\D/g, ''),
        genero: form.genero,
        telefono: form.telefono.trim(),
        calle: form.calle.trim(),
        numero: form.numero, // Enviar como number, no como string
        provinciaId: locationIds.provinciaId,
        paisId: locationIds.paisId,
      };

      log.info('[RegisterForm] 📦 Datos de registro preparados:', registrationData);
      log.info('[RegisterForm] 📊 Detalles de ubicación:', {
        paisId: locationIds.paisId,
        provinciaId: locationIds.provinciaId,
        pais: form.pais,
        provincia: form.provincia
      });

      log.info('[RegisterForm] 🚀 Enviando solicitud de registro al backend...');
      const response: RegisterResponse = await register(registrationData);

      log.info('[RegisterForm] ✅ Registro exitoso, respuesta del backend:', response);
      log.info('[RegisterForm] 🔍 Tipo de respuesta:', typeof response);
      log.info('[RegisterForm] 🔍 Propiedades de respuesta:', Object.keys(response || {}));
      log.info('[RegisterForm] 🔍 Alias recibido:', response?.alias);
      log.info('[RegisterForm] 🔍 CVU recibido:', response?.cvu);

      // 🎯 CORREGIDO: Mostrar mensaje de éxito con los datos reales de la respuesta
      const alias = response?.alias || 'sin-alias';
      const successMessage = response?.alias 
        ? `¡Registro exitoso! Tu alias es: ${response.alias}. Redirigiendo al login...` 
        : '¡Registro exitoso! Ya puedes iniciar sesión. Redirigiendo...';
        
      enqueueSnackbar(successMessage, {
        variant: 'success',
        autoHideDuration: 3000,
      });

      log.info('[RegisterForm] 🎉 Usuario registrado exitosamente con alias:', response?.alias || 'no-alias');
      log.info('[RegisterForm] 📱 CVU asignado:', response?.cvu || 'no-cvu');

      // Resetear formulario
      setForm({
        nombre: '',
        apellido: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fechaNacimiento: '',
        dni: '',
        genero: '',
        telefono: '',
        calle: '',
        numero: 0,
        provincia: '',
        pais: '',
      });
      setErrors({});
      setTouched({});
      setCurrentStep(1); // Resetear al primer paso

      // Navegar al login después de un breve delay para que el usuario vea el mensaje
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: unknown) {
      log.error('[RegisterForm] ❌ Error detallado en el registro:', error);
      
      // 🎯 NUEVO: Logging más detallado para diagnosticar
      if (error instanceof Error) {
        log.error('[RegisterForm] Mensaje de error:', error.message);
        log.error('[RegisterForm] Stack trace:', error.stack);
        log.error('[RegisterForm] Tipo de error:', error.constructor.name);
      }
      
      // 🎯 NUEVO: Verificar si es un error de red/axios
      const axiosError = error as any;
      if (axiosError?.response) {
        log.error('[RegisterForm] Response status:', axiosError.response.status);
        log.error('[RegisterForm] Response data:', axiosError.response.data);
        log.error('[RegisterForm] Response headers:', axiosError.response.headers);
      } else if (axiosError?.request) {
        log.error('[RegisterForm] Request sin respuesta:', axiosError.request);
      } else {
        log.error('[RegisterForm] Error de configuración:', axiosError.message);
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      log.info('[RegisterForm] 🔚 Finalizando proceso de registro');
      setLoading(false);
    }
  };

  // Validar campos solo cuando se tocan (onBlur), no en tiempo real
  useEffect(() => {
    Object.keys(touched).forEach((field) => {
      if (isFormField(field)) {
        const error = validateField(field as keyof FormState);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    });
  }, [touched]); // Removido 'form' para evitar validaciones en tiempo real

  // Limpiar validaciones de disponibilidad cuando el usuario cambia el valor
  useEffect(() => {
    if (form.email !== debouncedEmail) {
      setAvailability((prev) => ({ ...prev, email: undefined }));
      setLoadingChecks((prev) => ({ ...prev, email: false }));
    }
  }, [form.email, debouncedEmail]);

  useEffect(() => {
    if (form.username !== debouncedUsername) {
      setAvailability((prev) => ({ ...prev, username: undefined }));
      setLoadingChecks((prev) => ({ ...prev, username: false }));
    }
  }, [form.username, debouncedUsername]);

  return {
    form,
    errors,
    touched,
    currentStep,
    loading,
    showPassword,
    showConfirmPassword,
    handleChangeEvent,
    handleChange,
    handleBlur,
    handleNext,
    handleBack,
    handleSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleCloseSnackbar,
    availability,
    loadingChecks,
  };
};

export default useRegisterFormState;
