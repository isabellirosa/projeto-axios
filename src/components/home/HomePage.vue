<script setup>
import MenuGeral from '../navbar/MenuGeral.vue';
</script>

<template>
  <div class="content">
    <div class="blur-layer"></div>
    <MenuGeral/>
    <div class="text">
      <h1>MERRY CHRISTMAS</h1>
      <h4>watch the best Christmas movies here!</h4>
      <button>Movies</button>
    </div> 
  </div>
</template>

<style scoped>

.content {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center; 
  justify-content: flex-end;
  text-align: right; 
  padding-right: 5%;
}

.blur-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/src/assets/fundo.webp');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  filter: blur(1px);
  z-index: -1;
}

.text {
  position: relative;
  z-index: 1;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-end; 
  justify-content: center;
}

.text h1 {
  margin: 0;
  font-size: 85px;
}

.text h4 {
  margin-top: 10px;
  font-size: 30px;
  margin-bottom: 0;
}

button {
  width: 10vw;
  height: 5vh;
  background-color: transparent;
  border: 1px solid white;
  border-radius: 50px;
  cursor: pointer;
  font-size: 25px;
  color: white;
  font-weight: 600;
  margin-top: 20px;
  transition: 0.4s;
}

button:hover {
  background-color: white;
  color: black;
}

</style>
