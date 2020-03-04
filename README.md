# serverless-primer

A primer on how to create, run and deploy a NodejS Lambda AWS Serverless App

## What is Serverless

Serverless is a cloud computing execution model where the cloud provider dynamically manages the allocation and provisioning of servers. A serverless application runs in stateless compute containers that are event-triggered, ephemeral (may last for one invocation), and fully managed by the cloud provider. Pricing is based on the number of executions rather than pre-purchased compute capacity.

AWS Lambda https://aws.amazon.com/lambda/, for example, lets you run code without provisioning or managing servers. You pay only for the compute time you consume.

## Technologies

There are a number of technologies used in developing, deploying and monitoring a serverless App
- Serverless Framework https://serverless.com/framework/docs/providers/aws/ – an open source framework to build, test and deploy a serverless App
- Getting started with Serverless - https://serverless.com/framework/docs/getting-started/
- Github actions – a set of CD/CI actions to be performed when a Git commit, merge is performed. Typically used to perform a suite of CI functions and if they succeed, deploy the App to AWS
- AWS Lambda https://aws.amazon.com/lambda/ - lets you run code without provisioning or managing servers
- AWS – where the App is hosted
- AWS Management Console – a dashboard to view the health of your Apps, setup IAM (Identity and Access Management) roles. You can use the AWS Playground available in Galaxy

## Serverless Framework

The Serverless Framework is an open source CLI developed by Serverless Inc. The framework gives developers, teams and orgs all of the tools they need to build and operate serverless applications, in one simple, powerful & elegant experience.

The Framework consists of an open source CLI that makes it easy to develop, deploy and test serverless apps across different cloud providers (AWS, Azure, etc)

Checkout Getting  Started at https://serverless.com/framework/docs/getting-started/

## Other Helpful Links:

- AWS CLI https://aws.amazon.com/cli/
- AWS Lambda https://aws.amazon.com/lambda/
- Serverless AWS Provider https://serverless.com/framework/docs/providers/aws/

## Installation / Environment Setup:

**Prerequisites**

- [Node.js](https://nodejs.dev/how-to-install-nodejs) version 12 or higher

```  
$ npm install -g serverless
```

## Creating a project

```
$ serverless create --template aws-nodejs --name my-special-service --path my-special-service 
```

This command generates scaffolding for a service with AWS as a provider and nodejs as runtime. The scaffolding will be generated in the folder specified in the –-path parameter

## Invoking a Handler Locally

After the service is created, you can invoke a Lambda function as follows

```
$ serverless invoke local --function functionName
```

This runs your code locally by emulating the AWS Lambda environment.

```
$ serverless invoke local --function hello
Hello handler called......
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"hello handler executed successfully! Some value for MY_ENV_VAR\",\n  \"input\": \"\"\n}"
}
```

***Notice the logging "Hello handler called......" 

## Running Your App Locally

As your App gets more complex, you may wish to run the "entire" App. If so, you will require the NPM package serverless-offline

```
$ npm install serverless-offline
```
and update serverless.yml plugin section as follows

```
plugins:
      - serverless-offline
```

The serverless-offline package emulates AWS and API Gateway on your local machine

To run the App

```
$ serverless offline
Serverless: Starting Offline: dev/us-east-1.

Serverless: Routes for hello:
Serverless: POST /{apiVersion}/functions/serverless-primer-dev-hello/invocations

Serverless: Offline [HTTP] listening on http://localhost:3000
Serverless: Enter "rp" to replay the last request

Serverless: POST /v1/functions/serverless-primer-dev-hello/invocations (λ: hello)
```

You can make POST requests using the route of the Lambda function, example

```
$ curl -X POST http://localhost:3000/v1/functions/serverless-primer-dev-hello/invocations
{"statusCode":200,"body":"{\n  \"message\": \"hello handler executed successfully! Some value for MY_ENV_VAR\",\n  \"input\": {\n    \"isOffline\": true,\n    \"stageVariables\": {}\n  }\n}"}
```

## AWS Roles

Lambda functions assume an IAM (Identity and Access Management) role during execution: the framework creates this role, and set all the permission provided in the iamRoleStatements section of serverless.yml.

When you use serverless invoke local, the situation is quite different: the role isn't available (the function is executed on your local machine), so unless you set a different user directly in the code (or via a key pair of environment variables), the AWS SDK will use the default profile specified inside your AWS credential configuration file.

Checkout https://serverless.com/blog/abcs-of-iam-permissions/ to learn more about IAM Roles and Permissions.

## ARNs

Amazon Resource Names (ARNs) uniquely identify AWS resources. An ARN is required when you need to specify a resource unambiguously across all of AWS, such as in IAM policies, Amazon Relational Database Service (Amazon RDS) tags, and API calls.

ARN is really just a globally unique identifier for an individual AWS resource. It takes one of the following formats.

```
arn:partition:service:region:account-id:resource
arn:partition:service:region:account-id:resourcetype/resource
arn:partition:service:region:account-id:resourcetype:resource
```

example ARN:

```
<!-- Object in an Amazon S3 bucket -->
arn:aws:s3:::my_corporate_bucket/exampleobject.png
```

## Deploying to AWS

In order to deploy to AWS you need to have AWS credentials setup in ~/.aws/credentials

You can have multiple profiles, example [default] which contains AWS Production creds and [playground] containing AWS Playground (AWS Personal/Free Account) creds.

If you do not have AWS creds for the AWS Playground - follow the instructions in the [Setting up AWS Creds](#setting-up-aws-creds) section


An example ~/.aws/credentials file is

```
[default]
aws_access_key_id = <PROD_AWS_ACCESS_KEY>
aws_secret_access_key = <PROD_AWS_SECRET_KEY>
[playground]
aws_access_key_id = <PLAYGROUND_AWS_ACCESS_KEY>
aws_secret_access_key = <PLAYGROUND_AWS_SECRET_KEY>
```

To deploy the App, perform the following
```
$ AWS_PROFILE=playground sls deploy
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
........
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service serverless-primer.zip file to S3 (66.38 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
...............
Serverless: Stack update finished...
Service Information
service: serverless-primer
stage: dev
region: us-east-1
stack: serverless-primer-dev
resources: 6
api keys:
  None
endpoints:
  None
functions:
  hello: serverless-primer-dev-hello
layers:
  None
Serverless: Run the "serverless" command to setup monitoring, troubleshooting and testing.
```

To determine if your App has been deployed, run the following

```
$ AWS_PROFILE=playground sls invoke --function hello --data 'This is Jack'
(base) [~/git/serverless-primer (master)]
$ AWS_PROFILE=playground serverless deploy list
Serverless: Listing deployments:
Serverless: -------------
Serverless: Timestamp: 1582900291051
Serverless: Datetime: 2020-02-28T14:31:31.051Z
Serverless: Files:
Serverless: - compiled-cloudformation-template.json
Serverless: - serverless-primer.zip
Serverless: -------------
Serverless: Timestamp: 1582901241812
Serverless: Datetime: 2020-02-28T14:47:21.812Z
Serverless: Files:
Serverless: - compiled-cloudformation-template.json
Serverless: - serverless-primer.zip
```

## Removing a deployed App from AWS

First list the deployed Apps

```
$ AWS_PROFILE=playground serverless deploy list
```

Remove deployed Apps
```
$ AWS_PROFILE=playground serverless remove
Serverless: Getting all objects in S3 bucket...
Serverless: Removing objects in S3 bucket...
Serverless: Removing Stack...
Serverless: Checking Stack removal progress...
......
Serverless: Stack removal finished...
```

## Invoking a Handler in AWS

If you have deployed your App, you can invoke a Lambda function in AWS as follows

```
$ AWS_PROFILE=playground sls invoke --function hello --data 'This is Jack'
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"hello handler executed successfully! Some value for MY_ENV_VAR\",\n  \"input\": \"This is Jack\"\n}"
}
```

AWS_PROFILE=playground is the name of the "AWS Playground" Profile configured in ~/.aws/credentials

## Setting up AWS Creds

Go to Galaxy and click the z_AWS Playground App - this will login you in to AWS via SSO

In AWS Management Console enter "IAM" in the search box

In the left hand panel, select Users

In the searchbox, search for your userName, example 'jbyrne'

Click on the userName link and then the "Security Credentials" tab. If you have not previously saved your credentials, click the "Create Access Key" and save the aws_access_key_id and aws_secret_access_key in a profile section in ~/.aws/credentials

If you do not have a userName click "Add User", create and follow the instructions. Add the Users to the Developers Group when requested.

