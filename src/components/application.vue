<script>
export default {
  name: "Application"
}
</script>

<template>
  <div class="application">
    <header class="l-centered header">Header</header>
    <main class="s-white l-centered main">Main</main>
    <footer class="l-centered footer">Footer</footer>
  </div>
</template>

<style scoped>
  .l-centered {
    max-width: 100%;
    width: 800px;
    margin: 0 auto;
  }

  .s-white {
    background-color: #FFF;
  }

  .application {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header {
    height: 100px;
    flex-shrink: 0;
  }

  .main {
    height: 100%;
  }

  .footer {
    height: 20px;
    flex-shrink: 0;
  }
</style>
