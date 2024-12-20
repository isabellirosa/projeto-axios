<template>
    <header>
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/filmes">Filmes</router-link>
          <router-link to="/tv">Programas de TV</router-link>
        </nav>
      </header>
    <div v-if="isLoading" class="loading">
      <img class="gif-loading" is-full-page src="@/assets/natal.gif" />
    </div>
    <header>
      <nav>
        <MenuGeral />
      </nav>
    </header>
    <h1 class="titulo-pagina">Programas de tv Natalinos</h1>
  
    <!-- Lista de gêneros com carousel -->
    <Carousel :itemsToShow="7.8" :transition="500">
      <div class="carousel">
        <Slide v-for="genre in genres" :key="genre.id" @click="filterByGenre(genre.id)" class="genre-item carousel" :class="{ active: genre.id === filteredGenreId }">
          {{ genreStore.getGenreName(genre.id) }}
        </Slide>
      </div>
      <template #addons>
        <Navigation class="seta-generos" />
      </template>
    </Carousel>
  
    <!-- Programas de TV filtrados ou todos os gêneros -->
    <div v-if="filteredGenreId" class="tv-list">
      <h2 class="titulo-genero">{{ getGenreName(filteredGenreId) }}</h2>
      <div>
      <div class="tv-list">
        <TvCard
          v-for="tv in tvShows"
          :key="tv.id"
          :tv-item="tv"
          :current-genre-id="filteredGenreId"
          :get-genre-name="getGenreName"
          :format-date="formatDate"
          @open-tv="openTv"
        />
      </div>
    </div></div>
  
    <div v-else>
      <div v-for="genre in genres" :key="genre.id" class="genre-section">
        <h2 class="titulo-genero">{{ getGenreName(genre.id) }}</h2>
        <Carousel :itemsToShow="4.8" :transition="500">
          <Slide v-for="tv in genreTvShows[genre.id]" :key="tv.id">
            <TvCard
              :tv-item="tv"
              :current-genre-id="genre.id"
              :get-genre-name="getGenreName"
              :format-date="formatDate"
              @open-tv="(tvId) => $router.push({ name: 'TvDetails', params: { tvId } })"
            />
          </Slide>
          <template #addons>
            <Navigation class="seta-carosel" />
          </template>
        </Carousel>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import TvCard from "@/components/TvCard.vue";
  import api from "@/plugins/axios";
  import { useGenreStore } from "@/stores/genre";
  import { Carousel, Slide, Navigation } from "vue3-carousel";
  import "vue3-carousel/dist/carousel.css";
  import MenuGeral from '@/components/navbar/MenuGeral.vue'
  
  const genreStore = useGenreStore();
  
  const isLoading = ref(false);
  const genres = ref([]);
  const genreTvShows = ref({});
  const filteredGenreId = ref(null);
  const christmasKeywordId = ref(null);
  const tvShows = ref([]);
  
  const formatDate = (date) => new Date(date).getFullYear();
  const getGenreName = (id) => {
    const genre = genres.value.find((genre) => genre.id === id);
    return genre ? genre.name : "Desconhecido";
  };
  
  const fetchTvShowsByGenre = async (genreId) => {
    const response = await api.get("discover/tv", {
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
      tvShows.value = [];
    } else {
      filteredGenreId.value = genreId;
  
      if (!genreTvShows.value[genreId]) {
        isLoading.value = true;
        genreTvShows.value[genreId] = await fetchTvShowsByGenre(genreId);
        isLoading.value = false;
      }
  
      tvShows.value = genreTvShows.value[genreId];
    }
  };
  
  onMounted(async () => {
    isLoading.value = true;
    await genreStore.getAllGenres("tv");
    genres.value = genreStore.genres;
  
    await fetchChristmasKeyword();
  
    for (const genre of genres.value) {
      const tvShowsForGenre = await fetchTvShowsByGenre(genre.id);
  
      if (tvShowsForGenre.length >= 5) {
        genreTvShows.value[genre.id] = tvShowsForGenre;
      }
    }
  
    genres.value = genres.value.filter(
      (genre) => genreTvShows.value[genre.id] && genreTvShows.value[genre.id].length >= 5
    );
  
    isLoading.value = false;
  });
  </script>
  <style scoped>
  header {
      position: fixed; /* Deixa o menu fixo no topo */
      top: 0;
      left: 0;
      width: 100%;
      height:15vh;
      color: black;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content:flex-end;
      z-index: 10; /* Garante que o menu fique sobre o conteúdo */
      font-weight: 500;
      transition: background-color 0.3s ease; /* Transição suave para o fundo */
    }
  
  nav {
      display: flex;
      column-gap:60px;
    }
  
  nav a {
      text-decoration: none;
      color: black;
      transition: color 0.3s;
    }
  
  nav a:hover {
      font-weight: 600;
    }
  
  .titulo-pagina {
      margin-top: 17vh;
      font-family: "Cherry Swash", serif;
      font-weight: 400;
      font-style: normal;
      font-size: 50px;
      text-align: center;
      color: #1B4A14;
    }
  
  .titulo-genero {
    display: block;
    font-weight: 600;
    color: #B02525;
    margin: 0px 30px 30px 30px;
    border-bottom: 1.5px solid #B02525;
    width: 100%;
    margin: 0px 30px 30px 30px;
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
        height: min-content;
        border:1px solid #387250;
        border-radius: 1rem;
        padding: 0.5rem 1rem;
        color: #387250;
        transition: background-color 0.3s, box-shadow 0.3s;
        margin: 10px;
    
      }
      
  
  .genre-item:hover {
      cursor: pointer;
      background-color: #4e9e5f;
      box-shadow: 0 0 0.5rem #387250;
    }
  
  .tv-list {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }
  
  .genre-section {
      margin-bottom: 2rem;
    }
  
  .carousel {
      display: flex;
      margin: 10px 30px;
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
  
  .gif-loading {
      width: 400px;
    }
  </style>
  