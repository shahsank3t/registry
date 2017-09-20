<template>
  <div class="col-sm-12 text-center" :style="divStyle">
    <p class="noDataFound-text">No Data Found</p>
  </div>
</template>
<script>
  export default{
    name : "NoData",
    data(){
      return{
        divStyle : {
          backgroundImage: 'url(\'static/img/back-default.png\')',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
          backgroundSize: "50%",
          height: window.innerHeight - 124
        }
      };
    }
  };
</script>
