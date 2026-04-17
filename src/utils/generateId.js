export function generateId() {
  const lastId = Number(localStorage.getItem("lastId")) || 0;
  const newId = lastId + 1;
  localStorage.setItem("lastId", newId);
  return newId;
}