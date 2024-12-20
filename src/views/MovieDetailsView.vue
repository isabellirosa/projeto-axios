<script setup>
import { defineProps, onMounted } from 'vue'
import { useMovieStore } from '@/stores/movie'
import MenuGeral from '@/components/navbar/MenuGeral.vue'
const movieStore = useMovieStore()

const props = defineProps({
  movieId: {
    type: Number,
    required: true,
  },
})

onMounted(async () => {
  await movieStore.getMovieDetail(props.movieId)
  await movieStore.getMovieVideos(props.movieId)
})

const getTrailerUrl = (videos) => {
  const trailer = videos.find((video) => video.type === 'Trailer' && video.site === 'YouTube')
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
}
</script>

<template>
  <div class="main">
    <MenuGeral />
    <div
      class="background"
      :style="{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movieStore.currentMovie?.backdrop_path})`,
      }"
    >
      <div class="overlay">
        <div class="content">
          <div class="poster">
            <img
              :src="`https://image.tmdb.org/t/p/w300${movieStore.currentMovie?.poster_path}`"
              :alt="movieStore.currentMovie?.title"
            />
          </div>
          <div class="details">
            <h1>{{ movieStore.currentMovie?.title }}</h1>
            <p class="tagline">{{ movieStore.currentMovie?.tagline }}</p>
            <p class="overview">{{ movieStore.currentMovie?.overview }}</p>
            <div class="info">
              <p v-if="movieStore.currentMovie?.budget">
                Orçamento: ${{ movieStore.currentMovie.budget.toLocaleString() }}
              </p>
              <p>
                Avaliação: {{ movieStore.currentMovie?.vote_average }} <span class="star">★</span>
              </p>
            </div>
            <div class="actions">
              <div v-if="movieStore.movieVideos.length > 0">
                <button><a :href="getTrailerUrl(movieStore.movieVideos)" target="_blank">
                  Assistir Trailer
                </a></button>
              </div>
              <p v-else>Nenhum trailer disponível.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="production-companies" v-if="movieStore.currentMovie?.production_companies >0">
      <h2>Produtoras</h2>
      <div class="companies">
        <template
          v-for="company in movieStore.currentMovie?.production_companies"
          :key="company.id"
        >
          <img
            v-if="company.logo_path"
            :src="`https://image.tmdb.org/t/p/w92${company.logo_path}`"
            :alt="company.name"
          />
          <p v-else>{{ company.name }}</p>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
.main {
  font-family: Arial, sans-serif;
  color: #fff;
}

.background {
  background-size: cover;
  background-position: center;
  position: relative;
  height: 100vh;
  width: 100%;
}

.overlay {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 1));
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px;
}

.content {
  display: flex;
  column-gap: 32px;
  max-width: 1200px;
  width: 100%;
}

.poster img {
  border-radius: 10px;
  max-width: 100%;
}

.poster {
  width: 30vw;
}

.details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.details h1 {
  font-size: 40px;
  margin: 0;
}

.tagline {
  font-style: italic;
  color: #ddd;
  margin: 8px 0;
}

.overview {
  margin: 16px 0;
  font-size: 16px;
  line-height: 1.5;
  color: #ccc;
}

.info {
  margin: 16px 0;
  font-size: 16px;
}

.info p {
  margin: 16px 0;
}

.star {
  color: gold;
  font-size: 20px;
}

.actions {
  display: flex;
  gap: 16px;
}

.actions button {
  padding: 10px 16px;
  background-color: transparent;
  border: 1px solid white;
  border-radius: 50px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.actions button:hover {
  background-color: rgb(255, 255, 255);
  color: black;
}

.production-companies {
  margin: 32px 0;
  text-align: center;
}

.production-companies h2 {
  font-size: 24px;
  margin-bottom: 1rem;
}

.companies {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.companies img {
  max-height: 50px;
  object-fit: contain;
}

.companies p {
  font-size: 14px;
}

.actions button a{
    text-decoration: none;
    color: white;
}

.actions button a:visited{
    color: white;
}

.actions button a:hover{
    color: black;
}

.actions p{
 padding: 8px 16px;
  background-color: transparent;
  border: 1px solid white;
  border-radius: 50px;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

</style>
