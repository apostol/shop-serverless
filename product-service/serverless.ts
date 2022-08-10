import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import ProductSchema from 'src/models/product.schema.json';
import CategorySchema from 'src/models/category.schema.json';
import createProduct from '@functions/createProduct';
import deleteProduct from '@functions/deleteProduct';
import getProductsAvailable from '@functions/getProductsAvailable';
import getProductsById from '@functions/getProductsById';
import updateProduct from '@functions/updateProduct';

const serverlessConfiguration: AWS = {
  service: 'productService',
  frameworkVersion: '3',
  configValidationMode: 'off',
  plugins: [
    'serverless-esbuild',
    'serverless-auto-swagger',
    '@martinsson/serverless-openapi-documentation',
    'serverless-offline'
  ],
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
      PG_PASSWORD: '${env:PG_PASSWORD, ""}',
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
    "serverless-offline": {
      httpPort: 4000,
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
    documentation: {
      version: '1',
      title: 'QuestBook REST API',
      description: 'QuestBook REST API',
      models: [
          ProductSchema,
          CategorySchema,
      ]
    },
    autoswagger: {
      apiType: 'http',
      generateSwaggerOnDeploy: true,
      typefiles: [
        './types/src/model/product.schema.d.ts'
      ],
//      swaggerFiles: ['./doc/openAPI.json'],
      swaggerPath: 'swagger',
//      apiKeyHeaders: ['Authorization', 'anyOtherName']
//      useStage: true,
//      basePath: '/',
//      host: 'http://some-host',
      schemes: ['https'],
      excludeStages: ['prod']
    }
  },
  resources: {
		Resources: {
			GatewayResponseDefault4XX: {
				Type: "AWS::ApiGateway::GatewayResponse",
				Properties: {
					ResponseParameters: {
						'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
						'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Methods': "'*'"
					},
					ResponseType: "DEFAULT_4XX",
					RestApiId: {
						Ref: "ApiGatewayRestApi"
					}
				}
			}
		}
	},
};

module.exports = serverlessConfiguration;
