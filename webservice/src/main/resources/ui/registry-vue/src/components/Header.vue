<template>
  <b-navbar toggleable type="light" variant="inverse" toggle-breakpoint="md">

    <b-nav-toggle target="nav_collapse"></b-nav-toggle>

    <b-navbar-brand href="javascript:void(0)">
      <img src="static/img/logo.png" class="logo-image"/>
      <div class="logo-text"><strong>SCHEMA</strong>REGISTRY</div>
    </b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <b-nav-text>All Schemas</b-nav-text>
    </b-collapse>
  </b-navbar>
</template>
<script>
  export default{
    name : "Header"
  };
</script>
<style scoped>
.bg-inverse{
  background-color: #323544 !important;
  border-color: #2c2e3b;
  border-radius: 0;
}
</style>
