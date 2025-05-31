<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <!-- Logo and Desktop Navigation -->
        <div class="flex items-center space-x-4">
          <router-link to="/" class="text-xl font-bold text-blue-600">
            ⚡ Charging Stations
          </router-link>
          <!-- Desktop Navigation -->
          <div class="hidden md:flex space-x-4">
            <router-link to="/" class="nav-link">Dashboard</router-link>
            <router-link to="/stations" class="nav-link">
              {{ isAdmin ? "All Stations" : "My Stations" }}
            </router-link>
            <router-link to="/map" class="nav-link">Map View</router-link>
            <router-link v-if="isAdmin" to="/admin/users" class="nav-link">
              User Management
            </router-link>
            <router-link v-if="isAdmin" to="/admin/analytics" class="nav-link">
              Analytics
            </router-link>
          </div>
        </div>

        <!-- Desktop User Info and Logout -->
        <div class="hidden md:flex items-center space-x-4">
          <span class="text-gray-600">
            Welcome, {{ user?.name }}
            <span
              v-if="isAdmin"
              class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              Admin
            </span>
          </span>
          <button @click="handleLogout" class="btn btn-secondary">
            Logout
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            aria-label="Toggle menu"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- User Info -->
          <div class="px-3 py-2 text-gray-600 border-b border-gray-200 mb-2">
            <div class="font-medium">{{ user?.name }}</div>
            <div v-if="isAdmin" class="text-xs text-blue-600 mt-1">
              Administrator
            </div>
          </div>

          <!-- Navigation Links -->
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
            <svg
              class="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
              />
            </svg>
            Dashboard
          </router-link>

          <router-link
            to="/stations"
            class="mobile-nav-link"
            @click="closeMobileMenu"
          >
            <svg
              class="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            {{ isAdmin ? "All Stations" : "My Stations" }}
          </router-link>

          <router-link
            to="/map"
            class="mobile-nav-link"
            @click="closeMobileMenu"
          >
            <svg
              class="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Map View
          </router-link>

          <!-- Admin Only Links -->
          <template v-if="isAdmin">
            <router-link
              to="/admin/users"
              class="mobile-nav-link"
              @click="closeMobileMenu"
            >
              <svg
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              User Management
            </router-link>

            <router-link
              to="/admin/analytics"
              class="mobile-nav-link"
              @click="closeMobileMenu"
            >
              <svg
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Analytics
            </router-link>
          </template>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="mobile-nav-link w-full text-left text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <svg
              class="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from "vue";
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
    const isAdmin = computed(() => authStore.user?.role === "admin");
    const mobileMenuOpen = ref(false);

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false;
    };

    const handleLogout = () => {
      authStore.logout();
      success("Logged out successfully");
      closeMobileMenu();
      router.push("/login");
    };

    return {
      user,
      isAdmin,
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
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

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #374151;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}

.mobile-nav-link:hover {
  background-color: #f3f4f6;
  color: #2563eb;
}

.mobile-nav-link.router-link-active {
  background-color: #eff6ff;
  color: #2563eb;
}

/* Smooth transition for mobile menu */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
