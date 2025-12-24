// src/pages/Unidades.jsx
import { useEffect, useState } from 'react';
import { AdminSidebar } from "../components/admin/AdminSidebar";
import "./ModalStyle.css";


    const API = '/api1';

export function Unidades() {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // cuántas filas quieres por página

  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUA, setEditUA] = useState(null); // objeto UA (tiene id interno)
  const [form, setForm] = useState({ nombre: '', credito: '', carrera: '', semestre: '', tipo: 'OBLIGATORIA' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // NUEVO: lista de carreras para el select
  const [carreras, setCarreras] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/unidades`, { credentials: 'include' });
      setList(await res.json());
    } catch (e) {
      setMsg('Error cargando unidades');
    } finally {
      setLoading(false);
    }
  };

  // Carga de UAs
  useEffect(() => { load(); }, []);

  // NUEVO: carga de carreras desde el backend (igual que en RegistrarCurso)
  useEffect(() => {
    fetch('/api1/ObtenerCarreras', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setCarreras(data.carreras || []);
      })
      .catch((err) => console.error('Error al obtener las carreras:', err));
  }, []);

  const openCreate = () => {
    setEditUA(null);
    setForm({ nombre: '', credito: '', carrera: '', semestre: '', tipo: 'OBLIGATORIA' });
    setModalOpen(true);
  };

  const openEdit = (ua) => {
    setEditUA(ua); // guardamos para PUT por id
    setForm({
      nombre: ua.nombre ?? '',
      credito: ua.credito ?? '',
      carrera: ua.carrera ?? '',
      semestre: ua.semestre ?? '',
      tipo: ua.tipo ?? 'OBLIGATORIA'
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setMsg('');
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const payload = {
        nombre: form.nombre,
        credito: Number(form.credito),
        carrera: form.carrera,
        semestre: Number(form.semestre),
        tipo: form.tipo
      };

      let res;
      if (editUA) {
        res = await fetch(`${API}/api/unidades/${encodeURIComponent(editUA.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API}/api/unidades`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Operación no exitosa');

      await load();
      setMsg(editUA ? 'UA actualizada' : 'UA creada');
      setModalOpen(false);
    } catch (e) {
      setMsg(e.message || 'Error');
    }
  };

  const totalPages = Math.ceil(list.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;
const visibleItems = list.slice(startIndex, startIndex + itemsPerPage);

const nextPage = () => {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
};

const prevPage = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
};

  return (
    <div className='admin-container'>
      <AdminSidebar />
      <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
          <h1>Unidades de Aprendizaje</h1>
            
          </div>
          <div><button className='btn azul' onClick={openCreate}>Nueva UA</button></div>
          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
        </header>
    <div>
      
      {msg && <p>hola{msg}</p>}

      

      <hr />

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <section className="horario-section">
        <table className='horario-table'>
          <thead>
            <tr>
              {/* id interno ya no se muestra */}
              <th>Nombre</th>
              <th>Crédito</th>
              <th>Carrera</th>
              <th>Semestre</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
             {visibleItems.map((ua) => (
    <tr key={ua.id}>
      <td>{ua.nombre}</td>
      <td>{ua.credito}</td>
      <td>{ua.carrera}</td>
      <td>{ua.semestre}</td>
      <td>
        <button className='btn azul' onClick={() => openEdit(ua)}>Editar</button>
      </td>
    </tr>
  ))}

  {visibleItems.length === 0 && (
    <tr><td colSpan="5">Sin registros</td></tr>
  )}
          </tbody>
        </table>
        <div className="pagination-container">
  <button
    className="pagination-btn"
    onClick={prevPage}
    disabled={currentPage === 1}
  >
    ◀ Anterior
  </button>

  <span style={{ margin: "0 15px" }}>
    Página {currentPage} de {totalPages}
  </span>

  <button
    className="pagination-btn"
    onClick={nextPage}
    disabled={currentPage === totalPages}
  >
    Siguiente ▶
  </button>
</div>

        </section>
      )}
      

      {/* MODAL simple sin librerías */}
      {modalOpen && (
  <div className="ua-modal-overlay">
    <div className="ua-modal">
      <h3 className="ua-modal-title">
        {editUA ? "Editar Unidad de Aprendizaje" : "Nueva Unidad de Aprendizaje"}
      </h3>

      <form onSubmit={onSubmit} className="ua-form">
        <div className="form-group">
          <label>Nombre de la UA</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            placeholder="Ej. Programación Orientada a Objetos"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Créditos</label>
            <input
              name="credito"
              type="number"
              step="0.5"
              value={form.credito}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Semestre</label>
            <input
              name="semestre"
              type="number"
              value={form.semestre}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Carrera</label>
          <select
            name="carrera"
            value={form.carrera}
            onChange={onChange}
            required
          >
            <option value="">Seleccione una carrera</option>
            {carreras.map((c) => (
              <option key={c.id || c.nombre} value={c.nombre}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="ua-modal-actions">
          <button type="submit" className="btn azul">
            {editUA ? "Guardar cambios" : "Crear UA"}
          </button>
          <button type="button" className="btn blanco" onClick={closeModal}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
    
    </main>
    </div>
  );
}


