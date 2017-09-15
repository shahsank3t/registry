<template>
  <div class="dropdown btn-group" :class="{'open' : isOpen}" >
    <button id="sortDropdown" role="button" aria-haspopup="true" aria-expanded="false" type="button" class="sortDropdown" @click="isOpen = !isOpen">
      <span>Sort:
        <span class="font-blue-color">{{activeText}}</span>
      </span>
      <span class="caret"></span>
    </button>
    <ul role="menu" class="dropdown-menu" aria-labelledby="sortDropdown">
      <li v-for="item in menuList" role="presentation" :class="[item.label === activeText ? 'active' : '']">
        <a role="menuitem" tabindex="-1" @click.stop.default="itemClicked(item)" >{{item.label}}</a>
      </li>
    </ul>
  </div>
</template>
<script>
  export default{
    name : "DropDown-Vue",
    props : ["funcName","menuList"],
    data(){
      return{
        activeText : this.menuList.length ? this.menuList[0].label : '',
        isOpen : false
      };
    },

    methods : {
      itemClicked(obj){
        this.activeText = obj.label;
        this.isOpen = false;
        if(this.funcName){
          this.$emit(this.funcName,obj);
        }
      }
    }
  };
</script>
<style scoped>
.dropdown-menu > li > a {
  cursor: pointer;
}
</style>
