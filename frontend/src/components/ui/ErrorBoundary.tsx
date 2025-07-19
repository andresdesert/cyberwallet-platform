import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.log('🔴 [ErrorBoundary] getDerivedStateFromError disparado:', error.message);
    console.log('🔴 [ErrorBoundary] Stack trace:', error.stack);
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log profesional con más detalles
    console.error("🔴 [ErrorBoundary] Error capturado:", error);
    console.error("🔴 [ErrorBoundary] Error info:", errorInfo);
    console.error("🔴 [ErrorBoundary] Component stack:", errorInfo.componentStack);
    console.error("🔴 [ErrorBoundary] Error boundary activado en:", new Date().toISOString());
    
    // Log adicional para debugging
    if (error.name) console.log('🔴 [ErrorBoundary] Error name:', error.name);
    if (error.message) console.log('🔴 [ErrorBoundary] Error message:', error.message);
    
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: 32,
          background: "rgba(255,255,255,0.85)",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}>
          <h2 style={{ color: "#d32f2f", marginBottom: 16 }}>¡Algo salió mal!</h2>
          <p style={{ marginBottom: 16 }}>
            Ocurrió un error inesperado al mostrar esta sección.<br />
            Por favor, intenta recargar la página o vuelve al inicio.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <button onClick={this.handleReload} style={{ padding: "8px 20px", borderRadius: 8, background: "#3A6EDC", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>Reintentar</button>
            <button onClick={this.handleGoHome} style={{ padding: "8px 20px", borderRadius: 8, background: "#eee", color: "#3A6EDC", border: "none", fontWeight: 600, cursor: "pointer" }}>Volver al inicio</button>
          </div>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre style={{ marginTop: 24, color: "#b71c1c", fontSize: 14, maxWidth: 600, overflow: "auto" }}>
              {this.state.error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
} 