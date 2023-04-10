# backend

## Node Version

### `16.15.0`

## Resources
To add a table
- Go to src/model/schema.ts
- Add a new schema
- Import it in serverless.ts file
- deploy using `sls deploy -s dev`

## Project Structure
```
├── e2e
│   ├── jest.config.js          # Jest configuration file
├── src
│   ├── config                  # Project configuration folder
│   │   ├── index.ts            # Some configurations of project
│   ├── controller              # Lamba function controller
│   │   ├── applicant.ts        # controller for applicants CRUD
│   │   ├── assessment.ts       # controller for assessment CRUD
│   │   ├── skillmcq.ts         # controller for skillmcq CRUD
│   ├── model                   # Lamba function controller
│   │   │   ├── seed            # Seed data for local database
│   │   │   ├── IApplicant.ts   # Applicant table schema
│   │   │   ├── schema.ts       # Schema of whole dynamodb tables
│   ├── routing                 # Lamba funciton routings
│   ├── routing                 # Lamba funciton routings
│   │   ├── applicants.ts       # router for applicants CRUD
│   │   ├── assessment.ts       # router for assessment CRUD
│   │   ├── skillmcq.ts         # router for skillmcq CRUD
│   ├── service                 # Util files for controller
│   │   ├── applicants.ts       # utils for applicants CRUD
│   │   ├── assessment.ts       # utils for assessment CRUD
│   │   ├── skillmcq.ts         # utils for skillmcq CRUD
│   │   ├── utils.ts            # utils of small functions that commonly used in controller
│   │   ├── crmUtils.ts         # utils for dynamodb of the project
│   ├── tests                   # Testing files for the project
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

## Installation

```
nvm use v16.15.0

npm install -g serverless
npm install -g @aws-amplify/cli

cd backend/

# download node_modules
npm install
Note: If you face issues while doing npm install something like `node-gyp command is failed` or `\libpq is not installed`. Please use `brew install postgresql` and run `npm install` again 

# start the local development
npm run start
```
 --------------
 Note: To test the apis locally. Please create a .env file in your repo directory parallel to package.json. Sample .env file contents

 ```
    NODE_ENV: local
    AWS_KEY: ${{ secrets.AWS_KEY }}
    AWS_SECRET: ${{ secrets.AWS_SECRET }}
 ```
## Setup

```
amplify configure
# add access key and secret key for us-west-1
```

## Deploy

In project folder
```
run 'sls deploy'
```

### Development

`sls deploy -s dev`

### Production

`sls deploy -s prod`

## AWS Services

### SES

How to send emails through AWS SES
```
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendTemplatedEmail-property
```

## Change Cognito Custom Role

```
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminUpdateUserAttributes-property
```

### Services

Find all the utility files in the `src/service` folders
