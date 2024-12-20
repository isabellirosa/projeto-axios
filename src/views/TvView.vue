<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import { useGenreStore } from '@/stores/genre';
import { useRouter } from 'vue-router'
const router = useRouter()
function openTv(tvId) {
    router.push({ name: 'TvDetails', params: { tvId } });
}

const genreStore = useGenreStore();

const isLoading = ref(false);
const genres = ref([]);
const tv = ref([]);
const christmasKeywordId = ref(null); // ID da palavra-chave "Christmas"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function getGenreName(id) {
    const genero = genres.value.find((genre) => genre.id === id);
    return genero.name;
}
const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');

// Função para listar programas de TV com base no gênero e palavra-chave "Christmas"
const listTV = async (genreId) => {
    genreStore.setCurrentGenreId(genreId);
    isLoading.value = true;
    const start = Date.now();
    const response = await api.get('discover/tv', {
        params: {
            with_genres: genreId,
            with_keywords: christmasKeywordId.value, // Filtra pela palavra-chave "Christmas"
            language: 'pt-BR'
        }
    });
    tv.value = response.data.results;
    // Calcula o tempo restante para completar os 3 segundos
    const elapsed = Date.now() - start;
    const remaining = 2000 - elapsed;
    if (remaining > 0) {
        await delay(remaining);
    }

    isLoading.value = false;
};

// Função para buscar a palavra-chave "Christmas"
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
    await genreStore.getAllGenres('tv');
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
    <h1>Programas de TV de Natal</h1>
    <ul class="genre-list">
        <li v-for="genre in genres" :key="genre.id" @click="listTV(genre.id)" class="genre-item"
            :class="{ active: genre.id === genreStore.currentGenreId }">
            {{ genre.name }}
        </li>
    </ul>
    <div class="tv-list">
        <div v-for="item in tv" :key="item.id" class="tv-card">
            <img :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`" :alt="item.original_name"
                @click="openTv(item.id)" />
            <div class="tv-details">
                <p class="tv-title">{{ item.original_name }}</p>
                <p class="movie-release-date">{{ formatDate(item.first_air_date) }}</p>
                <p class="movie-genres">
                    <span v-for="genre_id in item.genre_ids" :key="genre_id" @click="listTV(genre_id)"
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
    background-color: #5d6424;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    align-self: center;
    color: #fff;
    display: flex;
    justify-content: center;
}

.genre-item:hover {
    cursor: pointer;
    background-color: #7d8a2e;
    box-shadow: 0 0 0.5rem #5d6424;
}

.tv-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.tv-card {
    width: 15rem;
    height: 30rem;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 0 0.5rem #000;
}

.tv-card img {
    width: 100%;
    height: 20rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.5rem #000;
}

.tv-details {
    padding: 0 0.5rem;
}

.tv-title {
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
