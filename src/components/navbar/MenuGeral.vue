<script setup>

</script>

<template>
    <header>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/filmes">Filmes</router-link>
      <router-link to="/tv">Programas de TV</router-link>
    </nav>
  </header>
</template>

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
 
  transition: background-color 0.3s ease; /* Transição suave para o fundo */
}

/* Navegação dentro do menu */
nav {
  display: flex;
  column-gap:60px;
}

nav a {
  text-decoration: none;
  color: white;
  transition: color 0.3s;
}

nav a:hover {
  font-weight: 600;
}
@media screen and (max-width: 500px) {
  nav a {
    font-size: 16px;
    text-decoration: none;
    color: white;
    transition: color 0.3s;
  }
  header {
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  nav {
    column-gap:20px;
  }
}
</style>