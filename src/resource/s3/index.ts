import { accountId, bucketName, getRegion } from "@config";

const ResumeBucket = {
  Type: "AWS::S3::Bucket",
  Properties: {
    BucketName: bucketName,
    AccessControl: "PublicRead",
  },
};

const UploadRole = {
  Type: "AWS::IAM::Role",
  Properties: {
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            Service: ["lambda.amazonaws.com"],
          },
          Action: "sts:AssumeRole",
        },
      ],
    },
    Policies: [
      {
        PolicyName: "upload-policy",
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["s3:PutObject", "s3:PutObjectAcl"],
              Resource: [`arn:aws:s3:::${bucketName}`],
            },
            {
              Effect: "Allow",
              Action: ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
              Resource: [`arn:aws:logs:${getRegion()}:${accountId}:log-group:/aws/lambda/*:*:*`],
            },
          ],
        },
      },
    ],
  },
};

const BucketPolicy = {
  Type: "AWS::S3::BucketPolicy",
  Properties: {
    Bucket: "!Ref Bucket",
    PolicyDocument: {
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: `arn:aws:s3:::${bucketName}`,
        },
      ],
    },
  },
};

export {
  ResumeBucket,
  BucketPolicy,
  UploadRole,
};
