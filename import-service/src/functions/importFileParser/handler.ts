import { formatJSONResponse } from '@libs/api-gateway';
import { Handler, S3Event } from 'aws-lambda'
import * as AWS from "aws-sdk"
import csv from "csv-parser"

const s3 = new AWS.S3({region: process.env.REGION});
const uploadFolder = process.env.UPLOAD_FOLDER;
const parsedFolder = process.env.PARSED_FOLDER;

export const main: Handler<S3Event, any> = async (event) => {  
  await Promise.all(event.Records.map(async record => {
    let filename = decodeURIComponent(record.s3.object.key);
    const _obj = s3.getObject({Bucket: record.s3.bucket.name, Key: filename})
    let data =  await new Promise<string>((resolve, reject) => {
      let datas:[] = []
      _obj.createReadStream()
        .pipe(csv())
        .on('data', (data) => datas.push(data))
        .on('end', () => resolve(JSON.stringify(datas)))
        .on("error", (err)=> reject(err))
    })
    let _data = Buffer.from(data)
    let to = filename.replace(uploadFolder,parsedFolder)
    let _uploadFile = to.replace('.csv','.json')
    console.log("Upload: ", _uploadFile)
    s3.upload({
      Bucket: record.s3.bucket.name,
      Key:_uploadFile,
      ContentType: 'application/json',
      Body: _data
    }).promise()

    console.log("Copy from: ", `${record.s3.bucket.name}/${filename}`)
    console.log("Copy To: ", `${record.s3.bucket.name}/${to}`)
    console.log("Copy Key: ", to)
    s3.copyObject({
      Bucket: record.s3.bucket.name,
      CopySource: `${record.s3.bucket.name}/${filename}`,
      Key: to
    }).promise()
    
    console.log("Delete: ", filename)
    s3.deleteObject({
      Bucket: record.s3.bucket.name,
      Key: filename
    }).promise()
  }))
  return formatJSONResponse({ message: "OK" });
};