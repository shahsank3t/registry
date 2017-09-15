<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <a @click.stop.default="expandClicked(itemData)">
        <slot name="pHeader"></slot>
        <div class="panel-sections" style="text-align: right;">
          <a class="collapsed collapseBtn" role="button" aria-expanded="false">
            <i class="collapseBtn fa" :class="[expanded ? 'fa-chevron-up' : 'fa-chevron-down']" >
            </i>
          </a>
        </div>
      </a>
    </div>
    <div class="panel-collapse collapse" :class="[expanded ? 'in' : '']">
      <slot name="pBody"></slot>
    </div>
  </div>
</template>
<script>
  export default{
    name : "Panel-Vue",
    props : {
      itemData : {
        type : Object,
        required : true
      },
      funcCallback : {
        type : Function,
        required : true
      }
    },
    data(){
      return {
        expanded : false
      };
    },

    methods : {
      expandClicked(){
        this.expanded = !this.expanded;
        this.funcCallback(this.expanded,this.itemData);
      }
    }
  };
</script>
