import { middyfy } from '@libs/lambda';
import * as AWS from "aws-sdk"
import { APIGatewayEvent, Handler } from 'aws-lambda';
import httpResponseSerializer from '@middy/http-response-serializer'
import middyJsonBodyParser from "@middy/http-json-body-parser"
import cors from "@middy/http-cors"
import inputOutputLogger from '@middy/input-output-logger'

const s3 = new AWS.S3({region: process.env.REGION })

const importProductsFile: Handler<APIGatewayEvent, any> = async (event) => {
  let filename = process.env.UPLOAD_FOLDER + event.queryStringParameters.name
  console.log(filename)
  const params = {
    Bucket: process.env.UPLOAD_BUCKET,
    Expires: 60,
    ContentType: 'text/csv',
    Key: filename
  }
  return await s3.getSignedUrlPromise('putObject', params)
};

export const main = middyfy(importProductsFile)
  .use(middyJsonBodyParser())
  .use(cors())
  .use(inputOutputLogger({
    logger: (request) => {
      console.log(request.event ?? request.response)
    },
    awsContext: true
  }))
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
));
