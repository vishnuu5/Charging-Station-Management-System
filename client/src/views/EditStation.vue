<template>
  <div class="space-y-6">
    <div class="flex items-center space-x-4">
      <router-link
        to="/stations"
        class="text-primary-600 hover:text-primary-500"
      >
        ← Back to Stations
      </router-link>
      <h1 class="text-3xl font-bold text-gray-900">Edit Charging Station</h1>
    </div>

    <div v-if="loading && !form.name" class="flex justify-center py-8">
      <div class="spinner"></div>
    </div>

    <div v-else class="card max-w-2xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Station Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="input"
              placeholder="Enter station name"
            />
          </div>

          <div>
            <label
              for="status"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Status *
            </label>
            <select id="status" v-model="form.status" required class="input">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="input"
            placeholder="Enter station description"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="latitude"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Latitude *
            </label>
            <input
              id="latitude"
              v-model="form.location.latitude"
              type="number"
              step="any"
              required
              class="input"
              placeholder="e.g., 37.7749"
            />
          </div>

          <div>
            <label
              for="longitude"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Longitude *
            </label>
            <input
              id="longitude"
              v-model="form.location.longitude"
              type="number"
              step="any"
              required
              class="input"
              placeholder="e.g., -122.4194"
            />
          </div>
        </div>

        <div>
          <label
            for="address"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <input
            id="address"
            v-model="form.location.address"
            type="text"
            class="input"
            placeholder="Enter full address"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              for="powerOutput"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Power Output (kW) *
            </label>
            <input
              id="powerOutput"
              v-model="form.powerOutput"
              type="number"
              min="1"
              max="350"
              required
              class="input"
              placeholder="e.g., 50"
            />
          </div>

          <div>
            <label
              for="connectorType"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Connector Type *
            </label>
            <select
              id="connectorType"
              v-model="form.connectorType"
              required
              class="input"
            >
              <option value="">Select connector type</option>
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="Tesla Supercharger">Tesla Supercharger</option>
            </select>
          </div>

          <div>
            <label
              for="price"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Price per kWh ($)
            </label>
            <input
              id="price"
              v-model="form.price"
              type="number"
              step="0.01"
              min="0"
              class="input"
              placeholder="e.g., 0.25"
            />
          </div>
        </div>

        <div class="flex space-x-4">
          <button type="submit" :disabled="loading" class="btn btn-primary">
            <span v-if="loading" class="spinner mr-2"></span>
            Update Station
          </button>
          <router-link to="/stations" class="btn btn-secondary">
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStationsStore } from "../stores/stations";
import { useToast } from "../composables/useToast";

export default {
  name: "EditStation",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const stationsStore = useStationsStore();
    const { success, error } = useToast();

    const form = ref({
      name: "",
      description: "",
      location: {
        latitude: "",
        longitude: "",
        address: "",
      },
      status: "Active",
      powerOutput: "",
      connectorType: "",
      price: "",
    });

    const loading = ref(false);

    const loadStation = async () => {
      const result = await stationsStore.getStation(route.params.id);
      if (result.success) {
        const station = result.station;
        form.value = {
          name: station.name,
          description: station.description || "",
          location: {
            latitude: station.location.latitude,
            longitude: station.location.longitude,
            address: station.location.address || "",
          },
          status: station.status,
          powerOutput: station.powerOutput,
          connectorType: station.connectorType,
          price: station.price || "",
        };
      } else {
        error(result.message);
        router.push("/stations");
      }
    };

    const handleSubmit = async () => {
      loading.value = true;

      // Convert string numbers to actual numbers
      const stationData = {
        ...form.value,
        location: {
          ...form.value.location,
          latitude: parseFloat(form.value.location.latitude),
          longitude: parseFloat(form.value.location.longitude),
        },
        powerOutput: parseFloat(form.value.powerOutput),
        price: form.value.price ? parseFloat(form.value.price) : undefined,
      };

      const result = await stationsStore.updateStation(
        route.params.id,
        stationData
      );

      if (result.success) {
        success("Charging station updated successfully!");
        router.push("/stations");
      } else {
        error(result.message);
      }

      loading.value = false;
    };

    onMounted(() => {
      loadStation();
    });

    return {
      form,
      loading,
      handleSubmit,
    };
  },
};
</script>
