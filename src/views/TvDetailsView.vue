<script setup>
import { defineProps, onMounted } from "vue";
import { useTvStore } from "@/stores/tv";
import MenuGeral from "@/components/navbar/MenuGeral.vue";

const tvStore = useTvStore();

const props = defineProps({
  tvId: {
    type: Number,
    required: true,
  },
});


onMounted(async () => {
  await tvStore.getTvDetail(props.tvId);
});
</script>

<template>
  <div class="main">
    <MenuGeral />
    <div
      class="background"
      v-if="tvStore.currentTv"
      :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tvStore.currentTv.backdrop_path})` }"
    >
      <div class="overlay">
        <div class="content">
          <div class="poster">
            <img
              :src="`https://image.tmdb.org/t/p/w300${tvStore.currentTv.poster_path}`"
              :alt="tvStore.currentTv.name"
            />
          </div>
          <div class="details">
            <h1>{{ tvStore.currentTv?.name }}</h1>
            <p class="tagline">{{ tvStore.currentTv.tagline }}</p>
            <p class="overview">{{ tvStore.currentTv.overview }}</p>
            <div class="info">
              <p v-if="tvStore.currentTv.budget">
                Orçamento: ${{ tvStore.currentTv.budget.toLocaleString() }}
              </p>
              <p>
                Avaliação: {{ tvStore.currentTv.vote_average }}
                <span class="star">★</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading">Carregando...</div>


    <section
      class="production-companies"
      v-if="tvStore.currentTv.production_companies && tvStore.currentTv.production_companies.length > 0"
    >
      <h2>Produtoras</h2>
      <div class="companies">
        <template
          v-for="company in tvStore.currentTv.production_companies"
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
  width: 30%;
  display: flex;
  align-items: center;
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
  margin: 8px 0;
}

.star {
  color: gold;
  font-size: 18px;
}

.actions {
  display: flex;
  gap: 16px;
}

.actions button {
  padding: 8px 16px;
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

.poster{
    width: 30vw;
}

.companies p {
  font-size: 14px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #ccc;
}
@media screen and (max-width: 500px) {
  .content {
    margin-top: 80px;
    flex-direction: column;
    padding: 30px;
  }
  .details h1 {
    font-size: 30px;
    margin: 0;
}
.overview {
  font-size: 14px;
}
}
</style>
