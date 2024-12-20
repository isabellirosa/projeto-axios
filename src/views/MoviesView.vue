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
    <h1 class="titulo-pagina">Filmes Natalinos</h1>
    <Carousel :itemsToShow="10.8" :transition="500">
        <div class="carousel">
        <Slide v-for="genre in genres"
        :key="genre.id"
        @click="filterByGenre(genre.id)"
        class="genre-item carousel"
        :class="{ active: genre.id === filteredGenreId }">
          <li> {{ genreStore.getGenreName(genre.id) }}</li>
        </Slide></div>
        <template #addons>
          <Navigation class="seta-generos" />
        </template>
      </Carousel>
    <!-- Filmes filtrados ou todos os gêneros -->
    <div v-if="filteredGenreId">
      <h2 class="titulo-genero">{{ getGenreName(filteredGenreId) }}</h2>
      <div class="movie-list">
      <MovieCard
      
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        :currentGenreId="currentGenreId"
        :getGenreName="getGenreName"
        :formatDate="formatDate"
        @open-movie="openMovie"
      /></div>
    </div>
  
    <div v-else>
      <div v-for="genre in genres" :key="genre.id" class="genre-section">
        <h2 class="titulo-genero">{{ getGenreName(genre.id) }}</h2>
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
            <Navigation class="seta-carosel" />
          </template>
        </Carousel>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import MovieCard from "@/components/MovieCard.vue";
  import MenuGeral from '@/components/navbar/MenuGeral.vue'
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
  
  const formatDate = (date) => new Date(date).getFullYear();
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
header {
  position: fixed; /* Deixa o menu fixo no topo */
  top: 0;
  left: 0;
  width: 100%;
  height:15vh;
  background-color: transparent;
  color: white;
  font-size: 25px;
  padding-right: 50px;
  display: flex;
  align-items: center;
  justify-content:flex-end;
  z-index: 10; /* Garante que o menu fique sobre o conteúdo */
 font-weight: 500;
 
  transition: background-color 0.3s ease;
  }

 
  /* Navegação dentro do menu */
  nav {
    display: flex;
    column-gap:60px;
  }
  
  nav a {
    text-decoration: none;
    color: #f3f3f3;
    transition: color 0.3s;
    cursor: pointer;
  }
  
  nav a:hover {
    font-weight: 600;
  }
  .carousel{
    display: flex;
    margin: 10px 30px;
  }
  .titulo-pagina{
    margin: 15vh 0vw 50px 0vw ;
    font-family: "Poppins", serif;;
    font-weight: 400;
    font-style: normal;
    font-size: 50px;
    text-align: center;
    color: #cf2e2e;
  }
  .titulo-genero{
    display: block;
    font-weight: 600;
    color:#cf2e2e;
    margin: 0px 30px 30px 70px;
    border-bottom: 1.5px solid #cf2e2e;;
  }
  .active {
    background-color:  #da131341 !important;
    color:white !important;
    font-weight: bolder;
  }
  
  .movie-genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    justify-content: center;
  }
  
  .movie-genres span {
    background-color:  #da13139d;
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
    background-color:  #da13139d;
    color:white;
    box-shadow: 0 0 0.5rem  #da13139d;
  }
  
  .gif-loading {
    width: 400px;
  }
  
  .loading {
    top:0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 9999;
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
    height: min-content;
    border:1px solid #e6e6e6;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    color: #e6e6e6;
    transition: background-color 0.3s, box-shadow 0.3s;
    margin: 10px;

  }
  
  .genre-item:hover {
    cursor: pointer;
    background-color: #da13139d;
    box-shadow: 0 0 0.5rem  #da13139d;
    color:white;
  }
  
  .movie-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin: 0px 60px;
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
  