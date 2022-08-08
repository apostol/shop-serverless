import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,  
  events: [
    {
      http: {
        method: 'get',
        path: 'product',
        cors: true,
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
