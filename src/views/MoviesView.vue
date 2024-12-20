<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';

const isLoading = ref(false);

const genres = ref([]);
const movies = ref([]);
const christmasKeywordId = ref(null); // ID da palavra-chave "Christmas"

const listMovies = async (genreId) => {
  isLoading.value = true;
  const response = await api.get('discover/movie', {
    params: {
      with_genres: genreId,
      with_keywords: christmasKeywordId.value, // Filtra pela palavra-chave "Christmas"
      language: 'pt-BR'
    }
  });
  movies.value = response.data.results
  isLoading.value = false;
};

// Função para buscar a palavra-chave de Natal (Christmas)
const fetchChristmasKeyword = async () => {
    const response = await api.get('search/keyword', {
        params: {
            query: 'Christmas',
            language: 'pt-BR'
        }
    });

    // Se encontrar a palavra-chave "Christmas", armazena o ID
    if (response.data.results.length > 0) {
        christmasKeywordId.value = response.data.results[0].id;
    }
};

onMounted(async () => {
    // Busca pelos gêneros de filmes
    const genreResponse = await api.get('genre/movie/list?language=pt-BR');
    genres.value = genreResponse.data.genres;

    // Busca o ID da palavra-chave "Christmas"
    await fetchChristmasKeyword();
});
</script>

<template>
    <!-- <img src="@/assets/C(2).gif" :alt="movie.title" /> -->
    <loading v-model:active="isLoading" is-full-page />
    <h1>Filmes de Natal</h1>
    <ul class="genre-list">
        <li v-for="genre in genres" :key="genre.id" @click="listMovies(genre.id)" class="genre-item">
            {{ genre.name }}
        </li>
    </ul>
    <div class="movie-list">
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
            <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
            <div class="movie-details">
                <p class="movie-title">{{ movie.title }}</p>
                <p class="movie-release-date">{{ movie.release_date }}</p>
                <p class="movie-genres">{{ movie.genre_ids }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.genre-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    list-style: none;
    padding: 0;
}

.genre-item {
    background-color: #387250;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    color: #fff;
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

.genre-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    list-style: none;
    margin-bottom: 2rem;
}
</style>
