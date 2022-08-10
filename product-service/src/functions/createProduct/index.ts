import { handlerPath } from '@utils/handler-resolver.util';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'product',
        cors: true,
      },
    },
  ],
};
