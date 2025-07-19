import log from 'loglevel'; // Import loglevel

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Regex patterns for validation
export const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
export const surnameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
export const usernameRegex = /^[a-zA-Z0-9_]+$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
export const phoneRegex = /^\d{10,15}$/;
export const streetRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+$/;
export const numberRegex = /^\d+$/;
export const dniRegex = /^\d{7,8}$/;
export const nameInputRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
export const surnameInputRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
export const streetInputRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+$/;

// Validación de email
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: 'El email es obligatorio' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'El formato del email no es válido' };
  }
  
  return { isValid: true };
};

// Validación de contraseña
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'La contraseña es obligatoria' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return { 
      isValid: false, 
      message: 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales' 
    };
  }
  
  return { isValid: true };
};

// Validación de DNI
export const validateDni = (dni: string): ValidationResult => {
  if (!dni) {
    return { isValid: false, message: 'El DNI es obligatorio' };
  }
  
  if (!dniRegex.test(dni)) {
    return { isValid: false, message: 'El DNI debe tener 7 u 8 dígitos' };
  }
  
  return { isValid: true };
};

// Validación de CVU
export const validateCvu = (cvu: string): ValidationResult => {
  if (!cvu) {
    return { isValid: false, message: 'El CVU es obligatorio' };
  }
  
  if (!/^\d{22}$/.test(cvu)) {
    return { isValid: false, message: 'El CVU debe tener exactamente 22 dígitos' };
  }
  
  return { isValid: true };
};

// Validación de alias
export const validateAlias = (alias: string): ValidationResult => {
  if (!alias) {
    return { isValid: false, message: 'El alias es obligatorio' };
  }
  
  if (alias.length < 3) {
    return { isValid: false, message: 'El alias debe tener al menos 3 caracteres' };
  }
  
  if (!/^[a-zA-Z0-9.]+$/.test(alias)) {
    return { isValid: false, message: 'El alias solo puede contener letras, números y puntos' };
  }
  
  return { isValid: true };
};

// Validación de monto
export const validateAmount = (amount: string): ValidationResult => {
  if (!amount) {
    return { isValid: false, message: 'El monto es obligatorio' };
  }
  
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) {
    return { isValid: false, message: 'El monto debe ser un número válido' };
  }
  
  if (parsed <= 0) {
    return { isValid: false, message: 'El monto debe ser mayor a 0' };
  }
  
  if (parsed > 999999999.99) {
    return { isValid: false, message: 'El monto no puede exceder $999,999,999.99' };
  }
  
  return { isValid: true };
};

// Validación de nombre
export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, message: 'El nombre es obligatorio' };
  }
  
  if (name.length < 2) {
    return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
  }
  
  if (!nameRegex.test(name)) {
    return { isValid: false, message: 'El nombre solo puede contener letras y espacios' };
  }
  
  return { isValid: true };
};

// Validación de username
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, message: 'El nombre de usuario es obligatorio' };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
  }
  
  if (username.length > 30) {
    return { isValid: false, message: 'El nombre de usuario no puede exceder 30 caracteres' };
  }
  
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: 'El nombre de usuario solo puede contener letras, números y guiones bajos' };
  }
  
  return { isValid: true };
};

// Validación de fecha de nacimiento
export const validateBirthDate = (birthDate: string): ValidationResult => {
  if (!birthDate) {
    return { isValid: false, message: 'La fecha de nacimiento es obligatoria' };
  }
  
  const date = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  
  if (isNaN(date.getTime())) {
    return { isValid: false, message: 'La fecha de nacimiento no es válida' };
  }
  
  if (age < 18) {
    return { isValid: false, message: 'Debes ser mayor de 18 años' };
  }
  
  if (age > 120) {
    return { isValid: false, message: 'La fecha de nacimiento no es válida' };
  }
  
  return { isValid: true };
};

// Validación de teléfono
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: 'El teléfono es obligatorio' };
  }
  
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, message: 'El teléfono debe tener entre 10 y 15 dígitos' };
  }
  
  return { isValid: true };
};

// Validación de dirección
export const validateAddress = (address: string): ValidationResult => {
  if (!address) {
    return { isValid: false, message: 'La dirección es obligatoria' };
  }
  
  if (address.length < 5) {
    return { isValid: false, message: 'La dirección debe tener al menos 5 caracteres' };
  }
  
  if (address.length > 100) {
    return { isValid: false, message: 'La dirección no puede exceder 100 caracteres' };
  }
  
  return { isValid: true };
};

// Función de validación genérica
export const validateField = (_value: string, fieldName: string, validator: (value: string) => ValidationResult): ValidationResult => {
  // TODO: Implementar validación genérica
  return { isValid: true };
};
