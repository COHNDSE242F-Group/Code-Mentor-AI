export async function fetchWithAuth(input: RequestInfo, init?: RequestInit, retryIfExpired = true) {
  const getToken = () => localStorage.getItem("token");

  const makeRequest = async () => {
    const token = getToken();
    const headers = new Headers(init?.headers || {});
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(input, { ...(init || {}), headers });
    return res;
  };

  let res = await makeRequest();

  if (res.status === 401 && retryIfExpired) {
    // Try to refresh demo token (dev helper)
    try {
      const r = await fetch("http://localhost:8000/fresh-demo-token");
      if (r.ok) {
        const body = await r.json();
        if (body && body.token) {
          localStorage.setItem("token", body.token);
          // Retry original request once
          res = await makeRequest();
        }
      }
    } catch (err) {
      console.warn("Failed to refresh demo token", err);
    }
  }

  return res;
}
