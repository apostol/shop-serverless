import { formatJSONResponse } from '@libs/api-gateway';
import { Handler, S3Event } from 'aws-lambda'
import * as AWS from "aws-sdk"
import csv from "csv-parser"

const queueUrl = process.env.SQS_URL;
const uploadFolder = process.env.UPLOAD_FOLDER;
const parsedFolder = process.env.PARSED_FOLDER;

export const main: Handler<S3Event, any> = async (event) => {
  const s3 = new AWS.S3({region: process.env.REGION});
  const sqs = new AWS.SQS({region: process.env.REGION});
  console.info('to SQS: ', queueUrl)
  await Promise.all(event.Records.map(async record => {
    try{
      let filename = decodeURIComponent(record.s3.object.key);
      const _obj = s3.getObject({Bucket: record.s3.bucket.name, Key: filename})
      let data =  await new Promise<any[]>((resolve, reject) => {
        let datas:any[] = []
        _obj.createReadStream()
          .pipe(csv({separator: ';'}))
          .on('data', async (data:any) => {
            console.log("Object:", JSON.stringify(data))
            datas.push(data)
            sqs.sendMessage({
              QueueUrl: queueUrl,
              MessageBody: JSON.stringify(data)
            },(err, data)=>{
              if (err){
                console.log('Error: SQS:', err)
              }
              console.log("Object sended:", data)
            }).send((err, _data)=>{
              console.error(err)
              console.log(JSON.stringify(_data))
            })
          })
          .on('end', () => resolve(datas))
          .on("error", (err)=> reject(err))
      })
      let _data = Buffer.from(JSON.stringify(data), 'utf-8')
      let to = filename.replace(uploadFolder,parsedFolder)
      let _uploadFile = to.replace('.csv','.json')
      console.log("Upload: ", _uploadFile)
      await s3.upload({
        Bucket: record.s3.bucket.name,
        Key:_uploadFile,
        ContentType: 'application/json',
        Body: _data
      }).promise().catch((err)=>console.log(err))
      console.log("Copy from: ", `${record.s3.bucket.name}/${filename}`)
      console.log("Copy To: ", `${record.s3.bucket.name}/${to}`)
      console.log("Copy Key: ", to)
      await s3.copyObject({
        Bucket: record.s3.bucket.name,
        CopySource: `${record.s3.bucket.name}/${filename}`,
        Key: to
      }).promise().catch((err)=>console.log(err))
      console.log("Delete: ", filename)
      await s3.deleteObject({
        Bucket: record.s3.bucket.name,
        Key: filename
      }).promise().catch((err)=>console.log(err))
    }catch(err){
      console.log(err)
    }
  }))
  return formatJSONResponse({ message: "OK" });
};