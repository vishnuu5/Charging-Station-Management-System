<template>
  <div class="space-y-6 px-4 md:px-0">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:justify-between md:items-center gap-2"
    >
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
        Charging Stations
      </h1>
      <router-link
        to="/stations/create"
        class="btn btn-primary self-start md:self-auto"
      >
        Add New Station
      </router-link>
    </div>

    <!-- Filters -->
    <div class="card">
      <h2 class="text-lg font-medium mb-4">Filters</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Status</label
          >
          <select v-model="filters.status" class="input w-full">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <!-- Connector Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Connector Type</label
          >
          <select v-model="filters.connectorType" class="input w-full">
            <option value="">All Types</option>
            <option value="Type 1">Type 1</option>
            <option value="Type 2">Type 2</option>
            <option value="CCS">CCS</option>
            <option value="CHAdeMO">CHAdeMO</option>
            <option value="Tesla Supercharger">Tesla Supercharger</option>
          </select>
        </div>
        <!-- Min Power -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Min Power (kW)</label
          >
          <input
            v-model="filters.minPower"
            type="number"
            class="input w-full"
            placeholder="0"
          />
        </div>
        <!-- Max Power -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Max Power (kW)</label
          >
          <input
            v-model="filters.maxPower"
            type="number"
            class="input w-full"
            placeholder="350"
          />
        </div>
      </div>
      <!-- Filter Buttons -->
      <div class="mt-4 flex flex-wrap gap-2">
        <button @click="applyFilters" class="btn btn-primary">
          Apply Filters
        </button>
        <button @click="clearFilters" class="btn btn-secondary">Clear</button>
      </div>
    </div>

    <!-- Stations List -->
    <div class="card">
      <div v-if="loading" class="flex justify-center py-8">
        <div class="spinner"></div>
      </div>
      <div
        v-else-if="stations.length === 0"
        class="text-center py-8 text-gray-500"
      >
        No charging stations found.
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="station in stations"
          :key="station._id"
          class="border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div
            class="flex flex-col sm:flex-row justify-between sm:items-start gap-3"
          >
            <div class="flex-1">
              <h3 class="text-base sm:text-lg font-semibold">
                {{ station.name }}
              </h3>
              <p class="text-gray-600 mt-1">
                {{ station.description || "No description" }}
              </p>
              <div class="mt-2 space-y-1">
                <p class="text-sm text-gray-500">
                  📍
                  {{
                    station.location.address ||
                    `${station.location.latitude}, ${station.location.longitude}`
                  }}
                </p>
                <div class="flex flex-wrap items-center gap-2 mt-2">
                  <span
                    class="text-xs px-2 py-1 rounded-full"
                    :class="getStatusClass(station.status)"
                  >
                    {{ station.status }}
                  </span>
                  <span class="text-sm text-gray-600"
                    >⚡ {{ station.powerOutput }} kW</span
                  >
                  <span class="text-sm text-gray-600"
                    >🔌 {{ station.connectorType }}</span
                  >
                  <span v-if="station.price" class="text-sm text-gray-600">
                    💰 ${{ station.price }}/kWh
                  </span>
                </div>
              </div>
            </div>
            <div class="flex gap-2 self-start">
              <router-link
                :to="`/stations/${station._id}/edit`"
                class="btn btn-secondary text-sm"
              >
                Edit
              </router-link>
              <button
                @click="deleteStation(station._id)"
                class="btn btn-danger text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="mt-6 flex justify-center">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="page in pagination.pages"
            :key="page"
            @click="changePage(page)"
            class="px-3 py-2 rounded-md text-sm"
            :class="
              page === pagination.current
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            "
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStationsStore } from "../stores/stations";
import { useToast } from "../composables/useToast";

export default {
  name: "Stations",
  setup() {
    const stationsStore = useStationsStore();
    const { success, error } = useToast();

    const stations = computed(() => stationsStore.stations);
    const loading = computed(() => stationsStore.loading);
    const pagination = computed(() => stationsStore.pagination);

    const filters = ref({
      status: "",
      connectorType: "",
      minPower: "",
      maxPower: "",
      page: 1,
    });

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

    const applyFilters = () => {
      filters.value.page = 1;
      stationsStore.fetchStations(filters.value);
    };

    const clearFilters = () => {
      filters.value = {
        status: "",
        connectorType: "",
        minPower: "",
        maxPower: "",
        page: 1,
      };
      stationsStore.fetchStations();
    };

    const changePage = (page) => {
      filters.value.page = page;
      stationsStore.fetchStations(filters.value);
    };

    const deleteStation = async (id) => {
      if (confirm("Are you sure you want to delete this charging station?")) {
        const result = await stationsStore.deleteStation(id);
        if (result.success) {
          success("Station deleted successfully");
        } else {
          error(result.message);
        }
      }
    };

    onMounted(() => {
      stationsStore.fetchStations();
    });

    return {
      stations,
      loading,
      pagination,
      filters,
      getStatusClass,
      applyFilters,
      clearFilters,
      changePage,
      deleteStation,
    };
  },
};
</script>
