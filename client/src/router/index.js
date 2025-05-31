import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/stations",
    name: "Stations",
    component: () => import("../views/Stations.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/map",
    name: "Map",
    component: () => import("../views/Map.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/stations/create",
    name: "CreateStation",
    component: () => import("../views/CreateStation.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/stations/:id/edit",
    name: "EditStation",
    component: () => import("../views/EditStation.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
