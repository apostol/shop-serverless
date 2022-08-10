import { handlerPath } from '@utils/handler-resolver.util';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,  
  events: [
    {
      http: {
        method: 'get',
        path: 'product',
        cors: true,
        documentation: {
          summary: "Product list",
          description: "Get product list",
          requestBody:{
            description: "A user information object"
          },
          requestModels: {
            "application/json": "Product"
          },          
          methodResponses: [
            {
              statusCode: 200,
              responseBody: {
                  description: "Product list"
              },
              responseModels: {
                "application/json": "Product"
              }
            },
            {
              statusCode: 500,
              responseBody: {
                description: "An error message when creating a new user"
              },
              responseModels: {
                "application/json": "Error"
              }
            }
          ]
        },
        responseData: {
          // response with description and response body
          200: {
              description: 'this went well',
              bodyType: 'Product',
          },
          // response with just a description
          400: {
              description: 'failed Post',
          },
          // shorthand for just a description
          502: 'server error',
        }
        // cors: {
        //   origin: '*',
        //   headers: [
        //     "Content-Type",
        //     "X-Amz-Date",
        //     "Authorization",
        //     "X-Api-Key",
        //     "X-Amz-Security-Token"
        //   ]
        // },
        // private: true,
        // async: true,
        // response: {
        //   headers: {
        //     "Access-Control-Allow-Origin": "'*'",
        //     "Access-Control-Allow-Methods": "'*'"
        //   }
        // }
      },
    },
  ],
};
