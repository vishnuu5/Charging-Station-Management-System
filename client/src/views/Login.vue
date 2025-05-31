<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="input rounded-t-md"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="input rounded-b-md"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full"
          >
            <span
              v-if="loading"
              class="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            Sign in
          </button>
        </div>

        <div class="text-center">
          <router-link to="/register" class="text-blue-600 hover:text-blue-500">
            Don't have an account? Sign up
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useToast } from "../composables/useToast";

export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const { success, error } = useToast();

    const form = ref({
      email: "",
      password: "",
    });

    const loading = ref(false);

    const handleLogin = async () => {
      loading.value = true;
      const result = await authStore.login(form.value);

      if (result.success) {
        success("Login successful!");
        router.push("/");
      } else {
        error(result.message);
      }
      loading.value = false;
    };

    return {
      form,
      loading,
      handleLogin,
    };
  },
};
</script>
