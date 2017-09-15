import Vue from 'vue';
import Router from 'vue-router';
import { routePaths } from '@/utils/Constants';
import SchemaRegistryContainer from '@/containers/Registry-Services/SchemaRegistry/SchemaRegistryContainer';
import SerializerDeserializerContainer from '@/containers/Registry-Services/SerializerDeserializer/SerializerDeserializerContainer';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: routePaths.SCHEMA_REGISTRY.path,
      name: routePaths.SCHEMA_REGISTRY.name,
      component: SchemaRegistryContainer
    },
    {
      path: routePaths.SERIALIAZER_DESERIALIAZER.path,
      name: routePaths.SERIALIAZER_DESERIALIAZER.name,
      component: SerializerDeserializerContainer
    }
  ]
});
