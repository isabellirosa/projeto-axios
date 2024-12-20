<script setup>
import { defineProps, defineEmits } from "vue";
import { useGenreStore } from "@/stores/genre";

const genreStore = useGenreStore();

const props = defineProps({
  tvItem: {
    type: Object,
    required: true,
  },
  currentGenreId: {
    type: Number,
    required: false,
  },
  getGenreName: {
    type: Function,
    required: true,
  },
  formatDate: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["open-tv", "list-tv"]);
</script>

<template>
  <div class="tv-card">
    <img 
      :src="`https://image.tmdb.org/t/p/w500${tvItem.poster_path}`" 
      :alt="tvItem.original_name" 
      @click="() => emit('open-tv', tvItem.id)" 
    />
    <div class="tv-details">
      <p class="tv-title">{{ tvItem.original_name }}</p>
      <p class="data">{{ formatDate(tvItem.first_air_date) }}</p>
      <p class="tv-genres">
        <!-- <span 
          v-for="genre_id in tvItem.genre_ids" 
          :key="genre_id" 
          @click="() => emit('list-tv', genre_id)" 
          :class="{ active: genre_id === genreStore.currentGenreId }"
        >
          {{ getGenreName(genre_id) }}
        </span> -->
      </p>
    </div>
  </div>
</template>

<style scoped>
.data{
  text-align: left;
  font-size: 12px;
  align-self: flex-start;
  color: white;
}
.active {
  background-color: #df1b1b !important;
  font-weight: bolder;
}

.tv-genres span.active {
  background-color: #abc322;
  color: #000;
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

.tv-genres span:hover {
  cursor: pointer;
  background-color: #455a08;
}

.tv-card {
  width: 15rem;
  height: 25rem;
  border-radius: 0.5rem;
  overflow: hidden;
}

.tv-card img {
  width: 100%;
  height: 20rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem #000;
  cursor: pointer;
}

.tv-details {
  padding: 0 0.5rem;
}

.tv-title {
  text-align: left;
  align-self: flex-start;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.3rem;
  color: white;
}
</style>
