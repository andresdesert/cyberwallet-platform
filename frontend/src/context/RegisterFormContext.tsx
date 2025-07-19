import React, { createContext, useContext } from "react";
import useRegisterFormState from "@/hooks/useRegisterFormState";
import log from 'loglevel'; // Import loglevel

export const RegisterFormContext = createContext<ReturnType<typeof useRegisterFormState> | null>(null);

export const useRegisterFormContext = () => {
  const context = useContext(RegisterFormContext);
  if (!context) {
    if (process.env.NODE_ENV === 'development') {
      log.error('[ERROR][DEV][RegisterFormContext] useRegisterFormContext debe usarse dentro de <RegisterFormContext.Provider>. Esto es un error crítico de desarrollo.');
      throw new Error("useRegisterFormContext debe usarse dentro de <RegisterFormContext.Provider>");
    } else {
      log.error('[ERROR][PROD][RegisterFormContext] El contexto del formulario de registro no está disponible. Posible error de configuración.');
      throw new Error("El contexto del formulario de registro no está disponible.");
    }
  }
  return context;
};

// ✅ Este es el provider faltante
export const RegisterFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const formState = useRegisterFormState();

  // 🎯 CRÍTICO: Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = React.useMemo(() => formState, [
    formState.currentStep,
    formState.loading,
    formState.form,
    formState.errors,
    formState.touched,
    formState.showPassword,
    formState.showConfirmPassword,
  ]);

  return (
      <RegisterFormContext.Provider value={contextValue}>
        {children}
      </RegisterFormContext.Provider>
  );
};
