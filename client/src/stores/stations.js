import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../services/api";

export const useStationsStore = defineStore("stations", () => {
  const stations = ref([]);
  const loading = ref(false);
  const pagination = ref({
    current: 1,
    pages: 1,
    total: 0,
  });

  const fetchStations = async (filters = {}) => {
    loading.value = true;
    try {
      const response = await api.get("/charging-stations", { params: filters });
      stations.value = response.data.stations;
      pagination.value = response.data.pagination;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch stations",
      };
    } finally {
      loading.value = false;
    }
  };

  const createStation = async (stationData) => {
    loading.value = true;
    try {
      const response = await api.post("/charging-stations", stationData);
      stations.value.unshift(response.data.station);
      return { success: true, station: response.data.station };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create station",
      };
    } finally {
      loading.value = false;
    }
  };

  const updateStation = async (id, stationData) => {
    loading.value = true;
    try {
      const response = await api.put(`/charging-stations/${id}`, stationData);
      const index = stations.value.findIndex((s) => s._id === id);
      if (index !== -1) {
        stations.value[index] = response.data.station;
      }
      return { success: true, station: response.data.station };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update station",
      };
    } finally {
      loading.value = false;
    }
  };

  const deleteStation = async (id) => {
    loading.value = true;
    try {
      await api.delete(`/charging-stations/${id}`);
      stations.value = stations.value.filter((s) => s._id !== id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete station",
      };
    } finally {
      loading.value = false;
    }
  };

  const getStation = async (id) => {
    loading.value = true;
    try {
      const response = await api.get(`/charging-stations/${id}`);
      return { success: true, station: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch station",
      };
    } finally {
      loading.value = false;
    }
  };

  return {
    stations,
    loading,
    pagination,
    fetchStations,
    createStation,
    updateStation,
    deleteStation,
    getStation,
  };
});
