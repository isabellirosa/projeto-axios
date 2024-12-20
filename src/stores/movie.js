import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useMovieStore = defineStore('movie', () => {
  const state = reactive({
    currentMovie: {},
    movieVideos: [], // Lista de vídeos
  });

  const currentMovie = computed(() => state.currentMovie);
  const movieVideos = computed(() => state.movieVideos);

  const getMovieDetail = async (movieId) => {
    const response = await api.get(`movie/${movieId}`);
    state.currentMovie = response.data;
  };

  const getMovieVideos = async (movieId) => {
    const response = await api.get(`movie/${movieId}/videos`);
    state.movieVideos = response.data.results;
  };

  return { currentMovie, movieVideos, getMovieDetail, getMovieVideos };
});
