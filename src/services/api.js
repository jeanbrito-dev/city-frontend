const BASE_URL = "http://localhost:3000";

// OCCURRENCES
export const getOccurrences = async () => {
  const res = await fetch(`${BASE_URL}/occurrences`);
  if (!res.ok) throw new Error("Erro ao buscar ocorrências");
  return res.json();
};

export const createOccurrence = async (data) => {
  const res = await fetch(`${BASE_URL}/occurrences`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar ocorrência");
  return res.json();
};

export const deleteOccurrence = async (id) => {
  const res = await fetch(`${BASE_URL}/occurrences/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar ocorrência");
  return res.json();
};

// AUTH
export const login = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro no login");
  return res.json();
};

export const register = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro no cadastro");
  return res.json();
};
