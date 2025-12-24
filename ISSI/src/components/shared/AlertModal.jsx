import React, { useEffect } from 'react';
import './AlertModal.css';

/**
 * AlertModal - Componente de modal personalizado para reemplazar alert()
 * 
 * Props:
 * - isOpen: boolean - Controla si el modal está visible
 * - onClose: function - Callback al cerrar el modal
 * - message: string - Mensaje a mostrar
 * - type: 'success' | 'error' | 'warning' | 'info' - Tipo de alerta
 * - title: string (opcional) - Título personalizado
 */
export function AlertModal({ isOpen, onClose, message, type = 'info', title }) {
  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l2 2 4-4" />
          </svg>
        );
      case 'error':
        return (
          <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        );
      default: // info
        return (
          <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        );
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'success': return '¡Éxito!';
      case 'error': return 'Error';
      case 'warning': return 'Advertencia';
      default: return 'Información';
    }
  };

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div 
        className={`alert-modal-container alert-modal-${type}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="alert-modal-header">
          {getIcon()}
          <h3 className="alert-modal-title">{title || getDefaultTitle()}</h3>
        </div>
        
        <div className="alert-modal-body">
          <p className="alert-modal-message">{message}</p>
        </div>
        
        <div className="alert-modal-footer">
          <button className={`alert-modal-btn alert-modal-btn-${type}`} onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
