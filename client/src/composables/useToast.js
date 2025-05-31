"use client";

import { ref } from "vue";

const toasts = ref([]);
let toastId = 0;

export function useToast() {
  const addToast = (message, type = "info", duration = 5000) => {
    const id = ++toastId;
    const toast = {
      id,
      message,
      type,
      visible: true,
    };

    toasts.value.push(toast);

    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  };

  const removeToast = (id) => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message, duration = 5000) =>
    addToast(message, "success", duration);
  const error = (message, duration = 5000) =>
    addToast(message, "error", duration);
  const warning = (message, duration = 5000) =>
    addToast(message, "warning", duration);
  const info = (message, duration = 5000) =>
    addToast(message, "info", duration);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
  };
}
