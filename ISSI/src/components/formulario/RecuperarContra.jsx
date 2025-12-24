import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecuperarContra.css';

export default function RecuperarContra() {
  const [step, setStep] = useState(1);
  const [boleta, setBoleta] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [changePasswordToken, setChangePasswordToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos en segundos
  const [tokenSendTime, setTokenSendTime] = useState(null);
  const navigate = useNavigate();
  const API = '/api1';

  // Timer para la cuenta regresiva
  useEffect(() => {
    let interval;
    if (step === 2 && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setError('El token ha expirado. Por favor solicita uno nuevo.');
            setStep(1);
            setBoleta('');
            setEmail('');
            setToken('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!boleta.trim() || !email.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/recuperar-contrasena/enviar-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boleta, email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setTimeLeft(300); // Reiniciar timer a 5 minutos
        setTokenSendTime(Date.now());
        setStep(2);
      } else {
        setError(data.message || 'Error al enviar el correo');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateToken = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token.trim()) {
      setError('Por favor ingresa el token');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/recuperar-contrasena/validar-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          boleta, 
          email, 
          token: token.replace(/\s/g, '').toLowerCase() // Remover espacios y enviar en minúsculas
        }),
      });

      const data = await response.json();
      console.log("Response from validar-token:", data);

      if (data.success) {
        console.log("changePasswordToken recibido:", data.changePasswordToken);
        setChangePasswordToken(data.changePasswordToken);
        setMessage(data.message);
        setStep(3);
      } else {
        setError(data.message || 'Token inválido');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al validar el token');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!nuevaContrasena.trim() || !confirmarContrasena.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (nuevaContrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/recuperar-contrasena/cambiar-contrasena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          changePasswordToken,
          nuevaContrasena,
          confirmarContrasena,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Contraseña actualizada correctamente. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
    setMessage('');
    if (step === 2) {
      setToken('');
      setTimeLeft(300);
    } else if (step === 3) {
      setNuevaContrasena('');
      setConfirmarContrasena('');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTokenChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').toUpperCase(); // Remover espacios existentes y convertir a mayúsculas
    if (value.length > 8) {
      value = value.substring(0, 8); // Limitar a 8 caracteres
    }
    // Agregar espacio después del 4to carácter para mejor visualización
    if (value.length > 4) {
      value = value.substring(0, 4) + ' ' + value.substring(4);
    }
    setToken(value);
  };

  return (
    <div className="recuperar-contra-container">
      <div className="recuperar-contra-card">
        <div className="card-header">
          <div className="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1>Verificación de Identidad</h1>
          <p className="subtitle">Paso {step} de 3</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendEmail}>
            <div className="step-description">
              <h3>Envío de Código de Verificación</h3>
              <p>
                Ingresa tu boleta/RFC y correo electrónico registrado. Te enviaremos un 
                código de verificación a tu correo registrado en el sistema para validar tu identidad.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="boleta">
                Boleta/RFC
              </label>
              <input
                type="text"
                id="boleta"
                placeholder="Ingresa tu número de boleta o RFC"
                value={boleta}
                onChange={(e) => setBoleta(e.target.value)}
                disabled={loading}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="input-field"
              />
            </div>

            {error && <div className="alert error">{error}</div>}
            {message && <div className="alert success">{message}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Enviando código...
                </>
              ) : (
                'Enviar Código de Verificación'
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleValidateToken}>
            <div className="step-description">
              <h3>Validación de Código</h3>
              <p>
                Revisa tu bandeja de entrada (y spam si es necesario). 
                Ingresa el código de 8 caracteres que te enviamos.
              </p>
            </div>

            <div className="countdown-box">
              <span className="countdown-label">Tiempo restante:</span>
              <span className={`countdown-timer ${timeLeft <= 60 ? 'warning' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="token">
                Código de Verificación
              </label>
              <input
                type="text"
                id="token"
                placeholder="ABCD 1234"
                value={token}
                onChange={handleTokenChange}
                disabled={loading}
                className="input-field token-input"
              />
              <small className="helper-text">Código de 8 caracteres • Expira en {formatTime(timeLeft)}</small>
            </div>

            {error && <div className="alert error">{error}</div>}
            {message && <div className="alert success">{message}</div>}

            <div className="button-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={loading}
              >
                Volver
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Validando...
                  </>
                ) : (
                  'Validar Código'
                )}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleChangePassword}>
            <div className="step-description">
              <h3>Nueva Contraseña</h3>
              <p>
                Crea una contraseña segura con al menos 6 caracteres. 
                Te recomendamos usar letras, números y símbolos.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="nuevaContrasena">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="nuevaContrasena"
                placeholder="Mínimo 6 caracteres"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                disabled={loading}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarContrasena">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmarContrasena"
                placeholder="Repite tu contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                disabled={loading}
                className="input-field"
              />
            </div>

            {error && <div className="alert error">{error}</div>}
            {message && <div className="alert success">{message}</div>}

            <div className="button-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={loading}
              >
                Volver
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Cambiando...
                  </>
                ) : (
                  'Guardar Nueva Contraseña'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
