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

// JWT helpers for client-side UI decisions
export function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getUserIdFromToken(): number | null {
  const token = localStorage.getItem('token');
  const payload = parseJwt(token);
  if (payload && payload.user_id) return Number(payload.user_id);
  return null;
}

export function getUserRoleFromToken(): string | null {
  const token = localStorage.getItem('token');
  const payload = parseJwt(token);
  if (payload && payload.role) return String(payload.role);
  return null;
}
