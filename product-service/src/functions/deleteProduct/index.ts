import { handlerPath } from '@libs/handler-resolver';
import { productScheme } from 'src/model/product.schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'product',
        cors: true,
        request: {
          schemas: {
            'application/json': productScheme,
          },
        },
      },
    },
  ],
};
