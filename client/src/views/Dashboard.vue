<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <router-link to="/stations/create" class="btn btn-primary">
        Add New Station
      </router-link>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">⚡</div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Stations</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ totalStations }}
            </p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">✅</div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active Stations</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ activeStations }}
            </p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">⚠️</div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Inactive Stations</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ inactiveStations }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Stations -->
    <div class="card">
      <h2 class="text-xl font-semibold mb-4">Recent Stations</h2>
      <div v-if="loading" class="flex justify-center py-8">
        <div class="spinner"></div>
      </div>
      <div
        v-else-if="stations.length === 0"
        class="text-center py-8 text-gray-500"
      >
        No charging stations found.
        <router-link to="/stations/create" class="text-primary-600"
          >Create your first station</router-link
        >
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="station in stations.slice(0, 5)"
          :key="station._id"
          class="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <h3 class="font-medium">{{ station.name }}</h3>
            <p class="text-sm text-gray-500">
              {{ station.location.address || "No address" }}
            </p>
            <div class="flex items-center space-x-4 mt-2">
              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="getStatusClass(station.status)"
              >
                {{ station.status }}
              </span>
              <span class="text-xs text-gray-500"
                >{{ station.powerOutput }} kW</span
              >
              <span class="text-xs text-gray-500">{{
                station.connectorType
              }}</span>
            </div>
          </div>
          <div class="flex space-x-2">
            <router-link
              :to="`/stations/${station._id}/edit`"
              class="btn btn-secondary text-xs"
            >
              Edit
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStationsStore } from "../stores/stations";

export default {
  name: "Dashboard",
  setup() {
    const stationsStore = useStationsStore();

    const stations = computed(() => stationsStore.stations);
    const loading = computed(() => stationsStore.loading);

    const totalStations = computed(() => stations.value.length);
    const activeStations = computed(
      () => stations.value.filter((s) => s.status === "Active").length
    );
    const inactiveStations = computed(
      () => stations.value.filter((s) => s.status === "Inactive").length
    );

    const getStatusClass = (status) => {
      switch (status) {
        case "Active":
          return "bg-green-100 text-green-800";
        case "Inactive":
          return "bg-red-100 text-red-800";
        case "Maintenance":
          return "bg-yellow-100 text-yellow-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    onMounted(() => {
      stationsStore.fetchStations();
    });

    return {
      stations,
      loading,
      totalStations,
      activeStations,
      inactiveStations,
      getStatusClass,
    };
  },
};
</script>
