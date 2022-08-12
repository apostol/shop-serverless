import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    profile: '${self:custom.profile.${self:custom.stage}}',    
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      UPLOAD_BUCKET: '${self:custom.s3ImportServiceBucket}',
      REGION: '${self:provider.region}',
      UPLOAD_FOLDER: '${self:custom.uploadFolder}',
      PARSED_FOLDER: '${self:custom.parsedFolder}'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [ "s3:ListBucket" ],
            Resource: "arn:aws:s3:::${self:custom.s3ImportServiceBucket}"
          },
          {
            Effect: "Allow",
            Action: [ "s3:*" ],
            Resource: "arn:aws:s3:::${self:custom.s3ImportServiceBucket}/*"
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: {
    importProductsFile,
    importFileParser
   },
  custom: {
    region: '${opt:region, self:provider.region}',
    stage: '${opt:stage, self:provider.stage, ""}',
    profile: {
      prod: 'free',
      dev: 'free'
    },    
    s3ImportServiceBucket: '${env:s3ImportServiceBucket, "smd-isb-vue"}',
    uploadFolder: 'uploaded/',
    parsedFolder: 'parsed/',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      UploadBucket: {
        Type: "AWS::S3::Bucket",
        DeletionPolicy: "Retain",
        Properties:{
          BucketName: "${self:custom.s3ImportServiceBucket}"
        }
      },
      BucketPolicyUploadBucket:{
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                  Action: [ "s3:GetObject" ],
                  Effect: "Allow",
                  Resource: "arn:aws:s3:::${self:custom.s3ImportServiceBucket}/*",
                  Principal: "*"
                }
            ]
          },
          Bucket: {
            Ref: "UploadBucket"
          }
        }
      }
    },
    Outputs: {
      UploadBucketName: {
        Value: {
          Ref: "UploadBucket"
        }
      }
    }
  },
  package: { individually: true }
};

module.exports = serverlessConfiguration;
