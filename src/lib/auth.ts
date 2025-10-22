export function parseJwt(token?: string): any | null {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getRoleFromToken(token?: string): string | null {
  const payload = parseJwt(token);
  if (!payload) return null;
  const raw = payload["role"] ?? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  if (!raw) return null;
  return Array.isArray(raw) ? String(raw[0]) : String(raw);
}
