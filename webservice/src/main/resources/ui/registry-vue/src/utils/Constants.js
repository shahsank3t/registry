const routePaths = {
  SCHEMA_REGISTRY: {name: 'SchemaRegistry', path: '/'},
  SERIALIAZER_DESERIALIAZER: {name: 'serdes', path: '/schemas/:schemaName/serdes'}
};
const baseUrl = '/api/v1/';

const pageSize = 25;

export {
  routePaths,
  baseUrl,
  pageSize
};
