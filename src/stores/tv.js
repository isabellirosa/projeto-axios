import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useTvStore = defineStore('tv', () => {
  const state = reactive({
    currentTv: {},
  });

  const currentTv = computed(() => state.currentTv);

  const getTvDetail = async (TvId) => {
    const response = await api.get(`tv/${TvId}`);
    state.currentTv = response.data;
  };

  return { currentTv, getTvDetail };
});