import { handlerPath } from '@utils/handler-resolver.util';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'product',
        cors: true,
        
      },
    },
  ],
};
