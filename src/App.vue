<template>
  <div id="app">
    <div class="bla">
      <Three></Three>
    </div>
  </div>
</template>

<script>
import Three from "./components/Three";
export default {
  name: "App",
  components: {
    Three,
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
.bla {
  width: 100%;
  height: 100vh;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
