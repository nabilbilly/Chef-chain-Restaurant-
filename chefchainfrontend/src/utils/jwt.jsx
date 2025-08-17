// src/utils/jwt.js
export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1]; // Extract the payload part of the token
    if (!base64Url) return null; // If there's no payload, return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); //
    const jsonPayload = decodeURIComponent( // Decode the base64Url string to get the JSON payload
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('parseJwt error', err);
    return null;
  }
}
