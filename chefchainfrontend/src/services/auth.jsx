import API from "./api";

// ✅ Register
export const registerUser = async (data) => {
  const res = await API.post("/register/", data);
  return res.data;
};

// ✅ Login (JWT token)
export const loginUser = async (data) => {
  const res = await API.post("/token/", data); // DRF simplejwt endpoint
  return res.data; // contains { access, refresh }
};

// ✅ Refresh token
export const refreshToken = async (refresh) => {
  const res = await API.post("/refresh/", { refresh });
  return res.data;
};

// ✅ Logout (if backend supports blacklisting)
export const logoutUser = async () => {
  const res = await API.post("/logout/");
  return res.data;
};

// ✅ Current user info
export const getCurrentUser = async () => {
  const res = await API.get("/user/");
  return res.data;
};
