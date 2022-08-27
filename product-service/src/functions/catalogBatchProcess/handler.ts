import ProductRepository from '@repository/productRepository';
import { SQSBatchItemFailure, SQSBatchResponse,  SQSHandler } from 'aws-lambda'
import * as AWS from "aws-sdk"
import { Product } from 'src/models/product.model';

interface sqsResult {
  item:Product,
  error:SQSBatchItemFailure
}

export const main: SQSHandler = async (event) => {  
  const snsTopicArn = process.env.SNS_ARN;
  const sns = new AWS.SNS({region: process.env.REGION});

  let batchItems = await Promise.all(event.Records.map<Promise<sqsResult>>(async record => {
    try{
      let _product
      if (Buffer.isBuffer(record.body)){
        _product = Buffer.from(record.body,'utf-8').toString()
      }else{
        _product = record.body
      }
      let json = JSON.parse(_product) as Product
      let item = await new ProductRepository().create(json)
      if (item == null){
        return {
          item: json,
          error: { itemIdentifier: record.messageId } 
        }
      }
      return {
        item: json,
        error: null
      }
    }catch(err){
      console.log(err)
      return {
        item:record.body,
        error: { itemIdentifier: record.messageId }
      }
    }
    return null
  }))
  let _failure = batchItems.filter(n=>n.error).map((i)=>i.error)
  await sns.publish({
    Subject: 'Result of import of product',
    Message: JSON.stringify(batchItems.filter(n=>!n.error).map(i=>i.item)),
    TopicArn: snsTopicArn
  }).promise()

  let resp: SQSBatchResponse = {
    batchItemFailures: _failure
  }
  return resp;
};