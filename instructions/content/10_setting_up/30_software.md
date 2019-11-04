+++
title = "Installs & Configs"
chapter = false
weight = 3
+++

Before you begin coding, there are a few things you need to install, update, and configure in the Cloud9 environment.

### Installing and updating

In the Cloud9 terminal, **run the following commands** to install and update some software you'll be using for this workshop:

```bash
# Update the AWS CLI
pip install --user --upgrade awscli

# Install and use Node.js v8.10 (to match AWS Lambda)
nvm install v12.13.0 --lts
nvm alias default v12.13.0

# Install the AWS CDK
npm install -g aws-cdk
```

{{% notice note %}}
These commands will take a few minutes to finish.
{{% /notice %}}

{{% notice info %}}
The AWS Cloud Development Kit (AWS CDK) is an open-source software development framework to define cloud infrastructure in code and provision it through AWS CloudFormation. The CDK integrates fully with AWS services and offers a higher level object-oriented abstraction to define AWS resources imperatively. Using the CDK’s library of infrastructure constructs, you can easily encapsulate AWS best practices in your infrastructure definition and share it without worrying about boilerplate logic. The CDK improves the end-to-end development experience because you get to use the power of modern programming languages to define your AWS infrastructure in a predictable and efficient manner.
{{% /notice %}}
