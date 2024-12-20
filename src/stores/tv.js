import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useTvStore = defineStore('tv', () => {
  const state = reactive({
    currentTv: {},
    tvVideos: [], 
  });

  const currentTv = computed(() => state.currentTv);
  const tvVideos = computed(() => state.tvVideos);

  const getTvDetail = async (TvId) => {
    const response = await api.get(`tv/${TvId}`);
    state.currentTv = response.data;
  };

 
  const getTvVideos = async (TvId) => {
    const response = await api.get(`tv/${TvId}/videos`);
    state.tvVideos = response.data.results; 
  };

  return { currentTv, tvVideos, getTvDetail, getTvVideos };
});
