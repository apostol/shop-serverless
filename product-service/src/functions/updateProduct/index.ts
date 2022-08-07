import { productScheme } from '../../model/product.schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'put',
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
