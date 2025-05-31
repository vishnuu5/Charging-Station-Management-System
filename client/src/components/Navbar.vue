<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center space-x-4">
          <router-link to="/" class="text-xl font-bold text-blue-600">
            ⚡ Charging Stations
          </router-link>
          <div class="hidden md:flex space-x-4">
            <router-link to="/" class="nav-link">Dashboard</router-link>
            <router-link to="/stations" class="nav-link">Stations</router-link>
            <router-link to="/map" class="nav-link">Map View</router-link>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <span class="text-gray-600">Welcome, {{ user?.name }}</span>
          <button @click="handleLogout" class="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useToast } from "../composables/useToast";

export default {
  name: "Navbar",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const { success } = useToast();

    const user = computed(() => authStore.user);

    const handleLogout = () => {
      authStore.logout();
      success("Logged out successfully");
      router.push("/login");
    };

    return {
      user,
      handleLogout,
    };
  },
};
</script>

<style scoped>
.nav-link {
  color: #6b7280;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}

.nav-link:hover {
  color: #2563eb;
}

.router-link-active {
  color: #2563eb;
  background-color: #eff6ff;
}
</style>
