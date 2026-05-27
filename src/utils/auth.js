export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Erro ao decodificar token JWT:", err);
    return null;
  }
};

export const getLoggedUser = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return decodeToken(token);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
