<template>
  <div id="app">
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#experimenz-nav" aria-expanded="false">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="/">Trouble Ticket API</a>
        </div>
        <div class="collapse navbar-collapse" id="experimenz-nav">
          <ul class="nav navbar-nav navbar-left">
            <li><router-link to="/"><a>V2 API</a></router-link></li>
            <li><router-link to="/hal"><a>HAL API</a></router-link></li>
          </ul>
        </div>
      </div>
    </nav>
   <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: black;
  margin-top: 75px;
}

</style>
