<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar v-if="isAuthenticated" />
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    <Toast />
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import Navbar from "./components/Navbar.vue";
import Toast from "./components/Toast.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Toast,
  },
  setup() {
    const authStore = useAuthStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);

    onMounted(() => {
      // Check if user is logged in on app start
      authStore.checkAuth();
    });

    return {
      isAuthenticated,
    };
  },
};
</script>
