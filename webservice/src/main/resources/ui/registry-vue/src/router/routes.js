import Vue from 'vue';
import Router from 'vue-router';
import { routePaths } from '@/utils/Constants';
import SchemaRegistryContainer from '@/containers/Registry-Services/SchemaRegistry/SchemaRegistryContainer';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: routePaths.SCHEMA_REGISTRY.path,
      name: routePaths.SCHEMA_REGISTRY.name,
      component: SchemaRegistryContainer
    }
  ]
});
