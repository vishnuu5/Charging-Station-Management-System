<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="input"
              placeholder="Full name"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="input"
              placeholder="Email address"
            />
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="input"
              placeholder="Password (min 6 characters)"
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
            Sign up
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
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
  name: "Register",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const { success, error } = useToast();

    const form = ref({
      name: "",
      email: "",
      password: "",
    });

    const loading = ref(false);

    const handleRegister = async () => {
      loading.value = true;
      const result = await authStore.register(form.value);

      if (result.success) {
        success("Registration successful!");
        router.push("/");
      } else {
        error(result.message);
      }
      loading.value = false;
    };

    return {
      form,
      loading,
      handleRegister,
    };
  },
};
</script>
