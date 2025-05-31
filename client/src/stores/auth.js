import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "../services/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token"));
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials) => {
    loading.value = true;
    try {
      const response = await api.post("/auth/login", credentials);
      const { token: authToken, user: userData } = response.data;

      token.value = authToken;
      user.value = userData;
      localStorage.setItem("token", authToken);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData) => {
    loading.value = true;
    try {
      const response = await api.post("/auth/register", userData);
      const { token: authToken, user: newUser } = response.data;

      token.value = authToken;
      user.value = newUser;
      localStorage.setItem("token", authToken);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
  };

  const checkAuth = async () => {
    if (!token.value) return;

    try {
      const response = await api.get("/auth/me");
      user.value = response.data.user;
    } catch (error) {
      logout();
    }
  };

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };
});
