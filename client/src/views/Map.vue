<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Map View</h1>
      <router-link to="/stations/create" class="btn btn-primary">
        Add New Station
      </router-link>
    </div>

    <div class="card">
      <div v-if="loading" class="flex justify-center py-8">
        <div class="spinner"></div>
      </div>
      <div v-else>
        <div id="map" class="leaflet-container"></div>
      </div>
    </div>

    <!-- Station Details Modal -->
    <div
      v-if="selectedStation"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">{{ selectedStation.name }}</h3>
          <button
            @click="selectedStation = null"
            class="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div class="space-y-2">
          <p class="text-gray-600">
            {{ selectedStation.description || "No description" }}
          </p>
          <p class="text-sm text-gray-500">
            📍
            {{
              selectedStation.location.address ||
              `${selectedStation.location.latitude}, ${selectedStation.location.longitude}`
            }}
          </p>
          <div class="flex items-center space-x-4">
            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="getStatusClass(selectedStation.status)"
            >
              {{ selectedStation.status }}
            </span>
            <span class="text-sm text-gray-600"
              >⚡ {{ selectedStation.powerOutput }} kW</span
            >
            <span class="text-sm text-gray-600"
              >🔌 {{ selectedStation.connectorType }}</span
            >
          </div>
          <div v-if="selectedStation.price" class="text-sm text-gray-600">
            💰 ${{ selectedStation.price }}/kWh
          </div>
        </div>
        <div class="mt-4 flex space-x-2">
          <router-link
            :to="`/stations/${selectedStation._id}/edit`"
            class="btn btn-primary text-sm"
          >
            Edit Station
          </router-link>
          <button
            @click="selectedStation = null"
            class="btn btn-secondary text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from "vue";
import { useStationsStore } from "../stores/stations";
import L from "leaflet";

export default {
  name: "Map",
  setup() {
    const stationsStore = useStationsStore();

    const stations = computed(() => stationsStore.stations);
    const loading = computed(() => stationsStore.loading);
    const selectedStation = ref(null);

    let map = null;
    let markers = [];

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

    const getMarkerColor = (status) => {
      switch (status) {
        case "Active":
          return "green";
        case "Inactive":
          return "red";
        case "Maintenance":
          return "orange";
        default:
          return "gray";
      }
    };

    const initMap = async () => {
      await nextTick();

      // Initialize map centered on Hyderabad, India
      map = L.map("map").setView([17.385, 78.4867], 11); // Hyderabad coordinates with zoom level 11

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Add markers for stations
      addMarkersToMap();
    };

    const addMarkersToMap = () => {
      // Clear existing markers
      markers.forEach((marker) => map.removeLayer(marker));
      markers = [];

      stations.value.forEach((station) => {
        const color = getMarkerColor(station.status);

        // Create custom icon based on status
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker(
          [station.location.latitude, station.location.longitude],
          { icon }
        )
          .addTo(map)
          .on("click", () => {
            selectedStation.value = station;
          });

        markers.push(marker);
      });

      // Fit map to show all markers, but if no markers exist, keep Hyderabad view
      if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    };

    onMounted(async () => {
      await stationsStore.fetchStations();
      initMap();
    });

    return {
      stations,
      loading,
      selectedStation,
      getStatusClass,
    };
  },
};
</script>

<style scoped>
.leaflet-container {
  height: 500px;
  width: 100%;
  border-radius: 8px;
}
</style>
