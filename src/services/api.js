const BASE_URL = "http://localhost:3000";

// OCCURRENCES
export const getOccurrences = async () => {
  const res = await fetch(`${BASE_URL}/occurrences`);
  if (!res.ok) throw new Error("Erro ao buscar ocorrências");
  return res.json();
};

export const getOccurrenceById = async (id) => {
  const res = await fetch(`${BASE_URL}/occurrences/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar ocorrência");
  return res.json();
};

export const getUserOccurrences = async (userId) => {
  const res = await fetch(
    `${BASE_URL}/occurrences?userId=${userId}`,
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar ocorrências do usuário");
  }

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

export const updateOccurrence = async (id, data) => {
  const res = await fetch(`${BASE_URL}/occurrences/${id}`, {
    method: "PUT", // ou PATCH se preferir parcial
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao atualizar ocorrência");
  return res.json();
};

export const toggleLike = async (id, userId) => {
  const res = await fetch(`${BASE_URL}/occurrences/${id}/like`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) throw new Error("Erro ao curtir ocorrência");
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

// USER
export const getUser = async (id) => {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`);

  if (!res.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  return res.json();
};

export const updateUser = async (id, data) => {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar usuário");
  }

  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar usuário");
  }

  return res.json();
};

// GEOCODE
export const reverseGeocode = async (lat, lon) => {
  const res = await fetch(`${BASE_URL}/geocode/reverse?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error("Erro ao buscar endereço");
  return res.json();
};

// COMMENTS
export const getComments = async (occurrenceId) => {
  const res = await fetch(`${BASE_URL}/comments/${occurrenceId}`);
  if (!res.ok) throw new Error("Erro ao buscar comentários");
  return res.json();
};

export const addComment = async (occurrenceId, data) => {
  const res = await fetch(`${BASE_URL}/comments/${occurrenceId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao adicionar comentário");
  return res.json();
};

export const updateComment = async (
  occurrenceId,
  commentId,
  data,
) => {
  const res = await fetch(
    `${BASE_URL}/comments/${occurrenceId}/${commentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    throw new Error("Erro ao atualizar comentário");
  }

  return res.json();
};

export const deleteComment = async (
  occurrenceId,
  commentId,
) => {
  const res = await fetch(
    `${BASE_URL}/comments/${occurrenceId}/${commentId}`,
    {
      method: "DELETE",
    },
  );

  if (!res.ok) {
    throw new Error("Erro ao deletar comentário");
  }

  return res.json();
};

export const updateReply = async (
  occurrenceId,
  commentId,
  replyId,
  data,
) => {
  const res = await fetch(
    `${BASE_URL}/comments/${occurrenceId}/${commentId}/reply/${replyId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    throw new Error("Erro ao atualizar resposta");
  }

  return res.json();
};

export const deleteReply = async (
  occurrenceId,
  commentId,
  replyId,
) => {
  const res = await fetch(
    `${BASE_URL}/comments/${occurrenceId}/${commentId}/reply/${replyId}`,
    {
      method: "DELETE",
    },
  );

  if (!res.ok) {
    throw new Error("Erro ao deletar resposta");
  }

  return res.json();
};

export const addReply = async (occurrenceId, commentId, data) => {
  const res = await fetch(
    `${BASE_URL}/comments/${occurrenceId}/${commentId}/reply`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) throw new Error("Erro ao adicionar resposta");
  return res.json();
};
