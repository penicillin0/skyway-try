const API_ENDPOINT = process.env.REACT_APP_BACKEND_API_BASE;

const toJson = async (res) => {
  const js = await res.json();
  if (res.ok) {
    return js;
  } else {
    throw new Error(js.message);
  }
};

export const getEvent = async (event_id) => {
  const resp = await fetch(`${API_ENDPOINT}/api/v1/event/${event_id}`, {
    credentials: "same-origin",
  });
  return await toJson(resp);
};

export const getAllEvent = async () => {
  const resp = await fetch(`${API_ENDPOINT}/api/v1/event`, {
    credentials: "same-origin",
  });
  return await toJson(resp);
};
