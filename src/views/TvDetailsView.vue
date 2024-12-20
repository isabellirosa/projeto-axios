<script setup>
import { defineProps, onMounted } from "vue";
import { useTvStore } from "@/stores/tv";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

const tvStore = useTvStore();

const props = defineProps({
  tvId: {
    type: Number,
    required: true,
  },
});

onMounted(async () => {
  // Carrega detalhes da série de TV
  await tvStore.getTvDetail(props.tvId);
  // Carrega as séries recomendadas ou relacionadas (exemplo)
  await tvStore.getTvRecommendations(props.tvId);
});
</script>

<template>
  <div class="main">
    <div class="content">
      <img
        :src="`https://image.tmdb.org/t/p/w185${tvStore.currentTv.poster_path}`"
        :alt="tvStore.currentTv.title"
      />

      <div class="details">
        <h1>Filme: {{ tvStore.currentTv.title }}</h1>
        <p>{{ tvStore.currentTv.tagline }}</p>
        <p>{{ tvStore.currentTv.overview }}</p>
        <p>Orçamento: ${{ tvStore.currentTv.budget }}</p>
        <p>Avaliação: {{ tvStore.currentTv.vote_average }}</p>
      </div>
    </div>
  </div>

  <p>Produtoras</p>
  <div class="companies">
    <template v-for="company in tvStore.currentTv.production_companies" :key="company.id">
      <img
        v-if="company.logo_path"
        :src="`https://image.tmdb.org/t/p/w92${company.logo_path}`"
        :alt="company.name"
      />
      <p v-else>{{ company.name }}</p>
    </template>
  </div>

  <h2>Séries Relacionadas</h2>
  <Carousel :itemsToShow="5.7" :transition="500" class="carousel">
    <Slide v-for="(relatedTv, index) in tvStore.tvRecommendations" :key="index">
      <div class="tv-card">
        <img
          :src="`https://image.tmdb.org/t/p/w185${relatedTv.poster_path}`"
          :alt="relatedTv.name"
          @click="() => tvStore.getTvDetail(relatedTv.id)"
        />
        <div class="tv-details">
          <h3>{{ relatedTv.name }}</h3>
          <p>{{ relatedTv.first_air_date }}</p>
        </div>
      </div>
    </Slide>
    <template #addons>
      <Navigation class="carousel-navigation" />
    </template>
  </Carousel>
</template>

<style scoped>
.companies {
  display: flex;
  flex-direction: row;
  column-gap: 3rem;
  align-items: center;
  margin-bottom: 2rem;
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

.tv-details h3 {
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 1rem;
}

.carousel {
  padding: 20px 0px 20px 90px !important;
}

.carousel-navigation {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  width: 100%;
  z-index: 10;
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
