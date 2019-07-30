+++
title = "Installs & Configs"
chapter = false
weight = 20
+++

Before you begin coding, there are a few things you need to install, update, and configure in the Cloud9 environment.

### Installing and updating

In the Cloud9 terminal, **run the following commands** to install and update some software you'll be using for this workshop:

```bash
# Update the AWS CLI
pip install --user --upgrade awscli

# Install and use Node.js v8.10 (to match AWS Lambda)
nvm install v8.11.0
nvm alias default v8.11.0

# Install the AWS CDK
npm install -g aws-cdk@0.34.0
```

{{% notice note %}}
These commands will take a few minutes to finish.
{{% /notice %}}

### Configuring a default region

A best practice is to deploy your infrastructure close to your customers, let's configure a default AWS region for this workshop : Northern Virginia (_us-east-1_) for North America or Ireland (_eu-west-1_) for Europe.

**Create an AWS config file**, run the following in the terminal :
{{% notice info %}}
Make sure the regions align, whatever region your running cloud9 in, choose that as your default.
{{% /notice %}}

{{% tabs %}}
{{% tab "us-east-1" "North America" %}}

```bash
cat <<END > ~/.aws/config
[default]
region=us-east-1
END
```

{{% /tab %}}

{{% tab  "eu-west-1"  "Europe" %}}

```bash
cat <<END > ~/.aws/config
[default]
region=eu-west-1
END
```

{{% /tab %}}

{{% tab  "ap-southeast-1"  "Singapore" %}}

```bash
cat <<END > ~/.aws/config
[default]
region=ap-southeast-1
END
```

{{% /tab %}}
{{% /tabs %}}

{{% notice info %}}
The AWS Cloud Development Kit (AWS CDK) is an open-source software development framework to define cloud infrastructure in code and provision it through AWS CloudFormation. The CDK integrates fully with AWS services and offers a higher level object-oriented abstraction to define AWS resources imperatively. Using the CDK’s library of infrastructure constructs, you can easily encapsulate AWS best practices in your infrastructure definition and share it without worrying about boilerplate logic. The CDK improves the end-to-end development experience because you get to use the power of modern programming languages to define your AWS infrastructure in a predictable and efficient manner.
{{% /notice %}}
