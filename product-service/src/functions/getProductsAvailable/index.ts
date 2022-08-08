import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        //cors: true,
        method: 'get',
        path: 'product/available'
      },
    },
  ],
};
