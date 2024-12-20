<template>
    <div v-if="isLoading" class="loading">
      <img class="gif-loading" is-full-page src="@/assets/natal.gif" />
    </div>
    <h1>Filmes de Natal</h1>
    <ul class="genre-list">
      <li
        v-for="genre in genres"
        :key="genre.id"
        @click="filterByGenre(genre.id)"
        class="genre-item"
        :class="{ active: genre.id === filteredGenreId }"
      >
        {{ genreStore.getGenreName(genre.id) }}
      </li>
    </ul>
  
    <!-- Filmes filtrados ou todos os gêneros -->
    <div v-if="filteredGenreId" class="movie-list">
      <h2>{{ getGenreName(filteredGenreId) }}</h2>
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        :currentGenreId="currentGenreId"
        :getGenreName="getGenreName"
        :formatDate="formatDate"
        @open-movie="openMovie"
      />
    </div>
  
    <div v-else>
      <div v-for="genre in genres" :key="genre.id" class="genre-section">
        <h2>{{ getGenreName(genre.id) }}</h2>
        <Carousel :itemsToShow="4.8" :transition="500">
          <Slide v-for="movie in genreMovies[genre.id]" :key="movie.id">
            <MovieCard
              :movie="movie"
              :currentGenreId="genre.id"
              :getGenreName="getGenreName"
              :formatDate="formatDate"
              @open-movie="(movieId) => $router.push({ name: 'MovieDetails', params: { movieId } })"
            />
          </Slide>
          <template #addons>
            <Navigation class="aa" />
          </template>
        </Carousel>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import MovieCard from "@/components/MovieCard.vue";
  import api from "@/plugins/axios";
  import { useGenreStore } from "@/stores/genre";
  import { Carousel, Slide, Navigation } from "vue3-carousel";
  import "vue3-carousel/dist/carousel.css";
  
  const genreStore = useGenreStore();
  
  const isLoading = ref(false);
  const genres = ref([]);
  const genreMovies = ref({}); 
  const filteredGenreId = ref(null); 
  const christmasKeywordId = ref(null); 
  const movies = ref([]); 
  
  const formatDate = (date) => new Date(date).toLocaleDateString("pt-BR");
  const getGenreName = (id) => {
    const genero = genres.value.find((genre) => genre.id === id);
    return genero ? genero.name : "Desconhecido";
  };
  
  const fetchMoviesByGenre = async (genreId) => {
    const response = await api.get("discover/movie", {
      params: {
        with_genres: genreId,
        with_keywords: christmasKeywordId.value,
        language: "pt-BR",
      },
    });
    return response.data.results;
  };
  
  const fetchChristmasKeyword = async () => {
    const response = await api.get("search/keyword", {
      params: {
        query: "Christmas",
        language: "pt-BR",
      },
    });
  
    if (response.data.results.length > 0) {
      christmasKeywordId.value = response.data.results[0].id;
    }
  };
  const filterByGenre = async (genreId) => {
    if (filteredGenreId.value === genreId) {
      filteredGenreId.value = null;
      movies.value = [];
    } else {
      filteredGenreId.value = genreId;

      if (!genreMovies.value[genreId]) {
        isLoading.value = true;
        genreMovies.value[genreId] = await fetchMoviesByGenre(genreId);
        isLoading.value = false;
      }
      movies.value = genreMovies.value[genreId];
    }
  };
  
  onMounted(async () => {
    isLoading.value = true;
    await genreStore.getAllGenres("movie");
    genres.value = genreStore.genres;
    await fetchChristmasKeyword();
    for (const genre of genres.value) {
      genreMovies.value[genre.id] = await fetchMoviesByGenre(genre.id);
    }
  
    isLoading.value = false;
  });
  </script>
  
  <style scoped>
  .active {
    background-color: #df1b1b !important;
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
  
  .movie-genres span.active {
    background-color: #abc322;
    color: #000;
  }
  
  .movie-genres span:hover {
    cursor: pointer;
    background-color: #455a08;
    box-shadow: 0 0 0.5rem #748708;
  }
  
  .gif-loading {
    width: 400px;
  }
  
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 999;
    background-color: #fffffffa;
  }
  
  .genre-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    list-style: none;
    margin-bottom: 2rem;
    padding: 0;
  }
  
  .genre-item {
    background-color: #387250;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    color: #fff;
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  
  .genre-item:hover {
    cursor: pointer;
    background-color: #4e9e5f;
    box-shadow: 0 0 0.5rem #387250;
  }
  
  .movie-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }
  
  .genre-section {
    margin-bottom: 2rem;
  }
  
  .carousel-navigation {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 50%;
    width: 100%;
    z-index: 1000000;
  }
  
  .carousel-navigation .carousel__prev,
  .carousel-navigation .carousel__next {
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
  }
  
  .carousel-navigation .carousel__prev:hover,
  .carousel-navigation .carousel__next:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
  </style>
  