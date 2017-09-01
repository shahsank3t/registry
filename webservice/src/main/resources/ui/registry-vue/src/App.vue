<template>
  <div>
    <app-header></app-header>
    <section class="container wrapper animated fadeIn">
      <router-view></router-view>
    </section>
    <notifications class="notificationStyle">
      <template slot="body" scope="props">
        <div :class="'vue-notification '+props.item.type">
            <a class="title">
              {{props.item.title}}
            </a>
            <a class="close" @click="props.close">
              <i class="fa fa-fw fa-close"></i>
            </a>
            <div v-html="props.item.text"></div>
        </div>
      </template>
    </notifications>
  </div>
</template>

<script>
  import Header from '@/components/Header';

  export default {
    name: 'app',
    components : {
      "app-header" : Header
    },

    computed : {}
  };
</script>
<style scoped>
.notificationStyle{
  margin-top:20px !important;
}
.vue-notification{
  border-radius: 10px;
  border-left-color: transparent;
  border-left : 0 !important;
}
.vue-notification > .close{
  font-size: 14px;
}
.vue-notification.success{
  background-color: #dff0d8;
  border-color: #d6e9c6;
  color: #3c763d;
}
.vue-notification.info{
  background-color: #d9edf7;
  border-color: #bce8f1;
  color: #31708f;
}
.vue-notification.warning{
  background-color: #fcf8e3;
  border-color: #faebcc;
  color: #8a6d3b;
}
.vue-notification.error{
  background-color: #f2dede;
  border-color: #ebccd1;
  color: #a94442;
}
</style>
