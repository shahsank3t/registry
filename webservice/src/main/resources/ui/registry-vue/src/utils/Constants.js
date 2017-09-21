const routePaths = {
  SCHEMA_REGISTRY: {name: 'SchemaRegistry', path: '/'},
  SERIALIAZER_DESERIALIAZER: {name: 'serdes', path: '/schemas/:schemaName/serdes'}
};
const baseUrl = '/api/v1/';

const pageSize = 25;

const notifyTextLimit = 90;

const statusCode = {
  Error: 0,
  Success: 1,
  Ok: 2,
  Processing: 3
};

export {
  routePaths,
  baseUrl,
  pageSize,
  notifyTextLimit,
  statusCode
};
