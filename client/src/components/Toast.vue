<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 w-80">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="getToastClass(toast.type)"
        class="w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden"
      >
        <div class="flex-1 p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="h-6 w-6 flex items-center justify-center">
                <span
                  v-if="toast.type === 'success'"
                  class="text-green-500 text-lg"
                  >✓</span
                >
                <span
                  v-else-if="toast.type === 'error'"
                  class="text-red-500 text-lg"
                  >✕</span
                >
                <span
                  v-else-if="toast.type === 'warning'"
                  class="text-yellow-500 text-lg"
                  >⚠</span
                >
                <span v-else class="text-blue-500 text-lg">ℹ</span>
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">
                {{ toast.message }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex border-l border-gray-200">
          <button
            @click="removeToast(toast.id)"
            class="w-10 h-full flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close"
          >
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { useToast } from "../composables/useToast";

export default {
  name: "Toast",
  setup() {
    const { toasts, removeToast } = useToast();

    const getToastClass = (type) => {
      const baseClass = "border-l-4 ";
      switch (type) {
        case "success":
          return baseClass + "border-green-500";
        case "error":
          return baseClass + "border-red-500";
        case "warning":
          return baseClass + "border-yellow-500";
        default:
          return baseClass + "border-blue-500";
      }
    };

    return {
      toasts,
      removeToast,
      getToastClass,
    };
  },
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
