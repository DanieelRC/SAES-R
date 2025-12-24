import { useState, useCallback } from "react";

/**
 * Hook personalizado para manejar alertas modales
 *
 * Uso:
 * const { alertState, showAlert, hideAlert, AlertModalComponent } = useAlert();
 *
 * // Mostrar alerta
 * showAlert('Mensaje aquí', 'success'); // success | error | warning | info
 *
 * // En el JSX
 * return (
 *   <>
 *     <AlertModalComponent />
 *     ... resto del componente
 *   </>
 * );
 */
export function useAlert() {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
    type: "info",
    title: "",
    onClose: null, // callback después de Aceptar
  });

  const showAlert = useCallback(
    (message, type = "info", title = "", onClose = null) => {
      setAlertState({
        isOpen: true,
        message,
        type,
        title,
        onClose,
      });
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlertState((prev) => {
      // ejecuta el callback si existe
      if (prev.onClose && typeof prev.onClose === "function") {
        prev.onClose();
      }

      return {
        ...prev,
        isOpen: false,
        onClose: null, // limpiar callback
      };
    });
  }, []);

  return {
    alertState,
    showAlert,
    hideAlert,
  };
}

export default useAlert;
