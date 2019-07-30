+++
title = "Bootstrapping the App"
chapter = false
weight = 20
+++

### Cloning the Repo

Well get started by cloning the code repo of the existing application

```bash
# clone the repo
git clone https://github.com/lucasschejtman/resttogql-workshop.git

# change into the infrastructure folder
cd resttogql-workshop/src/infrastructure/

```

### Deploying using the CDK

Inside the infrastructure all the neccessary services have been defined in code. We now need to run the CDK inside this folder and deploy the resultant CloudFormation templates.

{{% notice tip %}}
You can learn more about the cdk at [https://github.com/awslabs/aws-cdk](https://github.com/awslabs/aws-cdk).
{{% /notice %}}

```bash
# install modules
npm install

# build everything
npm run build

#bootstrap the cdk
#<accNum> = account to deploy into
#<region> = region to deploy into i.e ap-southeast-1
cdk bootstrap

# provision the application
cdk deploy --require-approval "never"
```

{{% notice warning %}}
The cdk deploy task will take around 10-12 mins to provision all the services used by the app - please be patient.
{{% /notice %}}

### Update Connection Strings

Now we have our backend provisioned, we need to update the client application to point to our new backend.

We get the connection strings from the bottom of the CDK output or from the CloudFormation output tab for the created stack.

This is how it looks in CloudFormation

![connection strings](/images/cdk-stack-outputs.png)

Our client was built using the Amplify libraries and React with connection strings stored in ".env" file.

{{% notice tip %}}
You can learn more about why we use ".env" in react apps at [https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables).
{{% /notice %}}

Open the .env file
(find it under)
~/environment/resttogql-workshop/src/web/.env

{{% notice tip %}}
If you cant see the file try the following to view hidden files: In the file browser, select the gear icon in the top right of the window
![viewing hidden files](/images/show_hidden_files.png)
{{% /notice %}}

Change the values, there should be placeholders in the file, these should map to the values from the CDK output shown above

```bash
REACT_APP_DEFAULT_REGION=[Your AWS Region]
REACT_APP_COGNITO_POOL_ID=[Your Cognito Pool ID]
REACT_APP_COGNITO_POOL_CLIENT_ID=[Your Cognito Pool Client ID]
REACT_APP_API_ENDPOINT=[Your APIGW Endpoint]
REACT_APP_APPSYNC_ENDPOINT=[Your AppSync Endpoint]
```

{{% notice warning %}}
Any time you change the .env file, then you will need to re-start the application
{{% /notice %}}

### Bootstrapping the App

In this section, you can run the AWS Step Functions state machine that was created to bootstrap our application. You can see the detailed definition of it by going to the service page but at a high level it will perform three steps.

1. Create a DynamoDB stream that will be processed by an AWS Lambda function to index information into ElasticSearch
2. Populate our DynamoDB table with some mock data
3. Create a test user in the user pool.

To execute it run the following command. You will find the ARN of the state machine as part of the stack outputs.

```bash
aws stepfunctions start-execution --state-machine-arn <state machine arn>
```

### Starting the App

Now let's start our development server so we can gain familiarity with the existing application

```bash
# goto web directory
cd ../web

# install modules
npm install

# start server
npm run start

```

Once the web server has started, click the **Preview** menu and **select Preview Running Application**

![preview running application](/images/preview_running_application.png)

If you'd like, you can also **pop the preview to a new window**:

![pop app to new window](/images/pop_browser_new_window.png)

Finally, **open another terminal window**. We'll leave this first terminal alone since it's running the web server process.

![new terminal](/images/c9_new_terminal.png)
