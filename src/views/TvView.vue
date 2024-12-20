<template>
    <div v-if="isLoading" class="loading">
      <img class="gif-loading" is-full-page src="@/assets/natal.gif" />
    </div>
    <h1>Programas de TV de Natal</h1>
  
    <!-- Lista de gêneros -->
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
  
    <!-- Programas de TV filtrados ou todos os gêneros -->
    <div v-if="filteredGenreId" class="tv-list">
      <h2>{{ getGenreName(filteredGenreId) }}</h2>
      <TvCard
        v-for="tv in tvShows"
        :key="tv.id"
        :tv-item="tv"
        :current-genre-id="currentGenreId"
        :get-genre-name="getGenreName"
        :format-date="formatDate"
        @open-tv="openTv"
      />
    </div>
  
    <div v-else>
      <div v-for="genre in genres" :key="genre.id" class="genre-section">
        <h2>{{ getGenreName(genre.id) }}</h2>
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
            <Navigation class="aa" />
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
  
  const genreStore = useGenreStore();
  
  const isLoading = ref(false);
  const genres = ref([]);
  const genreTvShows = ref({}); // Estrutura para armazenar os programas de TV por gênero
  const filteredGenreId = ref(null); // ID do gênero atualmente filtrado (null = mostrar todos)
  const christmasKeywordId = ref(null); // ID da palavra-chave "Christmas"
  const tvShows = ref([]); // Programas de TV filtrados para um gênero específico
  
  const formatDate = (date) => new Date(date).toLocaleDateString("pt-BR");
  const getGenreName = (id) => {
    const genre = genres.value.find((genre) => genre.id === id);
    return genre ? genre.name : "Desconhecido";
  };
  
  const fetchTvShowsByGenre = async (genreId) => {
    const response = await api.get("discover/tv", {
      params: {
        with_genres: genreId,
        with_keywords: christmasKeywordId.value, // Filtra pela palavra-chave "Christmas"
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
  
  // Filtrar por gênero específico
  const filterByGenre = async (genreId) => {
    if (filteredGenreId.value === genreId) {
      // Se o gênero já estiver selecionado, desmarcá-lo para mostrar todos os gêneros
      filteredGenreId.value = null;
      tvShows.value = []; // Limpa a lista de programas quando o filtro é removido
    } else {
      filteredGenreId.value = genreId;
  
      // Carregar programas se ainda não estiverem armazenados
      if (!genreTvShows.value[genreId]) {
        isLoading.value = true;
        genreTvShows.value[genreId] = await fetchTvShowsByGenre(genreId);
        isLoading.value = false;
      }
  
      // Atribuir os programas filtrados à variável tvShows
      tvShows.value = genreTvShows.value[genreId];
    }
  };
  
  onMounted(async () => {
    isLoading.value = true;
  
    // Busca os gêneros de programas de TV
    await genreStore.getAllGenres("tv");
    genres.value = genreStore.genres;
  
    // Busca o ID da palavra-chave "Christmas"
    await fetchChristmasKeyword();
  
    // Carrega programas de TV para todos os gêneros
    for (const genre of genres.value) {
      const tvShowsForGenre = await fetchTvShowsByGenre(genre.id);
  
      // Desconsidera gêneros com menos de 5 programas
      if (tvShowsForGenre.length >= 5) {
        genreTvShows.value[genre.id] = tvShowsForGenre;
      }
    }
  
    // Atualiza a lista de gêneros para mostrar apenas os com 5 ou mais programas
    genres.value = genres.value.filter(
      (genre) => genreTvShows.value[genre.id] && genreTvShows.value[genre.id].length >= 5
    );
  
    isLoading.value = false;
  });
  </script>
  
  <style scoped>
  /* Estilos existentes */
  .active {
    background-color: #df1b1b !important;
    font-weight: bolder;
  }
  
  .tv-genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    justify-content: center;
  }
  
  .tv-genres span {
    background-color: #748708;
    border-radius: 0.5rem;
    padding: 0.2rem 0.5rem;
    color: #fff;
    font-size: 0.8rem;
    font-weight: bold;
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  
  .tv-genres span.active {
    background-color: #abc322;
    color: #000;
  }
  
  .tv-genres span:hover {
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
  
  .tv-list {
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
  