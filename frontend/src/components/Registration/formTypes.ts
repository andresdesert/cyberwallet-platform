// src/components/Registration/formTypes.ts

export interface FormState {
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
  numero: number | string;
  provincia: string;
  pais: string;
}

export interface FormularioProps {
  form: Partial<FormState>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (_field: string, _value: string | number) => void;
  handleBlur: (_field: string) => void;
}
