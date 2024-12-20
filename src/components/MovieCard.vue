<script setup>
import { defineProps, defineEmits } from "vue";
import { useGenreStore } from '@/stores/genre';
const genreStore = useGenreStore();
const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
  currentGenreId: {
    type: Number,
    required: false,
  },
  getGenreName: {
    type: Function,
    required: true,
  },
  formatDate: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["open-movie", "list-movies"]);
</script>
<template>
    <div class="movie-card">
      <img 
        :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
        :alt="movie.title" 
        @click="() => emit('open-movie', movie.id)" 
      />
      <div class="movie-details">
        <p class="movie-title">{{ movie.title }}</p>
        <p class="movie-release-date">{{ formatDate(movie.release_date) }}</p>
        <p class="movie-genres">
          <span 
            v-for="genre_id in movie.genre_ids" 
            :key="genre_id" 
            @click="() => emit('list-movies', genre_id)" 
            :class="{ active: genre_id === genreStore.currentGenreId }"
          >
            {{ getGenreName(genre_id) }}
          </span>
        </p>
      </div>
    </div>
  </template>
  <style scoped>
  .active {
    background-color: #df1b1b !important;
    font-weight: bolder;
  }
  
  .movie-genres span.active {
    background-color: #abc322;
    color: #000;
    font-weight: bolder;
  }
  
  .movie-genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    justify-content: center;
  }
  
  .movie-genres span {
    background-color: #748708;
    border-radius: 0.5rem;
    padding: 0.2rem 0.5rem;
    color: #fff;
    font-size: 0.8rem;
    font-weight: bold;
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  
  .movie-genres span:hover {
    cursor: pointer;
    background-color: #455a08;
    box-shadow: 0 0 0.5rem #748708;
  }
  
  .movie-card {
    width: 15rem;
    height: 30rem;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 0 0.5rem #000;
  }
  
  .movie-card img {
    width: 100%;
    height: 20rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.5rem #000;
  }
  
  .movie-details {
    padding: 0 0.5rem;
  }
  
  .movie-title {
    font-size: 1.1rem;
    font-weight: bold;
    line-height: 1.3rem;
    height: 3.2rem;
  }
  </style>
  
