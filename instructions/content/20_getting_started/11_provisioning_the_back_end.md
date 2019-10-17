+++
title = "Provisioning the Back End"
chapter = false
weight = 11
+++

### Cloning the Repo

Well get started by cloning the code repo of the existing application and provisioning the supporting AWS services for the existing application.

Inside the infrastructure all the neccessary services have been defined in code. We then need to run the CDK inside this folder and deploy the resultant CloudFormation templates.

{{% notice tip %}}
You can learn more about the cdk at [https://github.com/awslabs/aws-cdk](https://github.com/awslabs/aws-cdk).
{{% /notice %}}

{{% tabs %}}
{{% tab "event-type-1" "Pre-provisioned Accounts" %}}

<b>Choose this Tab for large organised workshops with pre-provisioned accounts</b>

```bash
# change into the infrastructure folder
cd resttogql-workshop/src/infrastructure/

# install modules
npm install

# build everything
npm run build

#bootstrap the cdk
cdk bootstrap

# provision the application
cdk deploy --require-approval "never"

```
 
{{% /tab %}}

{{% tab  "event-type-2"  "Personal Accounts" %}}

<b>Choose this Tab for small workshops or running in your own personal account</b>

```bash
# clone the repo
git clone https://github.com/lucasschejtman/resttogql-workshop.git

# change into the infrastructure folder
cd resttogql-workshop/src/infrastructure/

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

{{% /tab %}}

{{% /tabs %}}


{{% notice warning %}}
The cdk deploy task will take around 10-12 mins to provision all the services used by the app - please be patient.
{{% /notice %}}
