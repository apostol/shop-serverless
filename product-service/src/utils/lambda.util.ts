import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import cors from "@middy/http-cors"
import httpErrorHandler from '@middy/http-error-handler'
import httpResponseSerializer from '@middy/http-response-serializer'
import inputOutputLogger from '@middy/input-output-logger'

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(httpErrorHandler())
    .use(cors())
    .use(httpResponseSerializer(
      {
        serializers: [
          {
            regex: /^application\/xml$/,
            serializer: ({ body }) => `<message>${body}</message>`,
          },
          {
            regex: /^application\/json$/,
            serializer: ({ body }) => JSON.stringify(body)
          },
          {
            regex: /^text\/plain$/,
            serializer: ({ body }) => body
          }
        ],
        defaultContentType: 'application/json'
      }
    ))
    .use(inputOutputLogger({
      logger: (request) => {
        console.log(request.event ?? request.response)
      },
      awsContext: true
    }))
}
