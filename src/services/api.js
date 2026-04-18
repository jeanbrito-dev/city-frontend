const BASE_URL = "http://localhost:3000/occurrences";

export const getOccurrences = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const createOccurrence = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteOccurrence = async (id) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};