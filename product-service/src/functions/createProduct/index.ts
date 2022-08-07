import { handlerPath } from '@libs/handler-resolver';
import { productScheme } from 'src/model/product.schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'product',
        request: {
          schemas: {
            'application/json': productScheme,
          },
        },
      },
    },
  ],
};