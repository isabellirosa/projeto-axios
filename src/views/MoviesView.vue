<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import { useGenreStore } from '@/stores/genre';
import { useRouter } from 'vue-router'
const router = useRouter()
function openMovie(movieId) {
    router.push({ name: 'MovieDetails', params: { movieId } });
}

const genreStore = useGenreStore();

const isLoading = ref(false);

const genres = ref([]);
const movies = ref([]);
const christmasKeywordId = ref(null); // ID da palavra-chave "Christmas"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getGenreName(id) {
    const genero = genres.value.find((genre) => genre.id === id);
    return genero.name;
}
const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');
const listMovies = async (genreId) => {
    genreStore.setCurrentGenreId(genreId)
    isLoading.value = true;

    // Inicia a busca dos filmes
    const start = Date.now();
    const response = await api.get('discover/movie', {
        params: {
            with_genres: genreId,
            with_keywords: christmasKeywordId.value, // Filtra pela palavra-chave "Christmas"
            language: 'pt-BR'
        }
    });

    movies.value = response.data.results;

    // Calcula o tempo restante para completar os 3 segundos
    const elapsed = Date.now() - start;
    const remaining = 2000 - elapsed;
    if (remaining > 0) {
        await delay(remaining);
    }

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
    isLoading.value = true;
    await genreStore.getAllGenres('movie');
    genres.value = genreStore.genres;

    // Busca o ID da palavra-chave "Christmas"
    await fetchChristmasKeyword();
    isLoading.value = false;
});
</script>


<template>
    <div v-if="isLoading" class="loading">
        <img class="gif-loading" is-full-page src="@/assets/natal.gif" />
    </div>
    <h1>Filmes de Natal</h1>
    <ul class="genre-list">
        <li v-for="genre in genres" :key="genre.id" @click="listMovies(genre.id)" class="genre-item"
            :class="{ active: genre.id === genreStore.currentGenreId }">
            {{ genreStore.getGenreName(genre.id) }}
        </li>
    </ul>
    <div class="movie-list">
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
            <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title"
                @click="openMovie(movie.id)" />
            <div class="movie-details">
                <p class="movie-title">{{ movie.title }}</p>
                <p class="movie-release-date">{{ formatDate(movie.release_date) }}</p>
                <p class="movie-genres">
                    <span v-for="genre_id in movie.genre_ids" :key="genre_id" @click="listMovies(genre_id)"
                        :class="{ active: genre_id === genreStore.currentGenreId }">
                        {{ getGenreName(genre_id) }}
                    </span>
                </p>
            </div>
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
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    gap: 0.2rem;
}

.movie-genres span {
    background-color: #748708;
    border-radius: 0.5rem;
    padding: 0.2rem 0.5rem;
    color: #fff;
    font-size: 0.8rem;
    font-weight: bold;
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
    background-color: #fffffffa;
}

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
