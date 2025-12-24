const API = "/api1/api";

async function jfetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Error del servidor");
  return data;
}

export const reviewsApi = {
  listarProfes: ({ search = "", sort = "mejor" } = {}) =>
    jfetch(`${API}/profesores?search=${encodeURIComponent(search)}&sort=${sort}`),

  resumenProfesor: (id) => jfetch(`${API}/profesores/${id}/resumen`),

  resenasProfesor: (id, { page = 1, limit = 10, sort = "recent" } = {}) =>
    jfetch(`${API}/profesores/${id}/resenas?page=${page}&limit=${limit}&sort=${sort}`),

  crearResena: (idProfesor, payload) =>
    jfetch(`${API}/profesores/${idProfesor}/resenas`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  votarUtil: (reviewId, value = 1) =>
    jfetch(`${API}/resenas/${reviewId}/voto`, {
      method: "POST",
      body: JSON.stringify({ value }),
    }),
};
