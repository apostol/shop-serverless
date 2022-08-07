import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import createProduct from '@functions/createProduct';
import deleteProduct from '@functions/deleteProduct';
import getProductsAvailable from '@functions/getProductsAvailable';
import getProductsById from '@functions/getProductsById';
import updateProduct from '@functions/updateProduct';

const serverlessConfiguration: AWS = {
  service: 'productService',
  frameworkVersion: '3',
  configValidationMode: 'error',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    profile: '${self:custom.profile.${self:custom.stage}}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PG_HOST: '${opt:pg_host, "qb-base.cuiavnuwfd3p.eu-west-1.rds.amazonaws.com"}',
      PG_PORT: '${opt:pg_port, "5432"}',
      PG_USERNAME: '${opt:pg_username, "postgres"}',
      PG_PASSWORD: '${opt:pg_password, ""}',
      PG_DATABASE: '${opt:pg_database, "questbooks"}',
    },
  },
  // import the function via paths
  functions: {
    getProductsList,
    createProduct,
    deleteProduct,
    getProductsAvailable,
    getProductsById,
    updateProduct
  },
  package: { individually: true },
  custom: {
    region: '${opt:region, self:provider.region}',
    stage: '${opt:stage, self:provider.stage, ""}',
    profile: {
      prod: 'free',
      dev: 'free'
    },
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
