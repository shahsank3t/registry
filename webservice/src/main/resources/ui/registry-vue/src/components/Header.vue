<template>
  <nav class="navbar navbar-inverse">
      <div class="navbar-header">
        <a href="javascript:void(0);" class="navbar-brand">
          <img src="static/img/logo.png" class="logo-image">
          <div class="logo-text">
            <strong>SCHEMA</strong>REGISTRY
          </div>
        </a>
        <button type="button" class="navbar-toggle collapsed" @click="showMenu = !showMenu">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>
      <div class="navbar-collapse collapse" :class="{'in' : showMenu}">
        <ul class="nav navbar-nav"></ul>
        <p class="navbar-text navbar-left">All Schemas</p>
      </div>
  </nav>
</template>
<script>

  export default{
    name : "Header",

    data(){
      return {
        showMenu : false
      };
    }
  };
</script>
<style scoped>
.navbar-collapse.in {
    overflow-y: auto;
}
.collapse.in {
    display: block;
}
</style>
