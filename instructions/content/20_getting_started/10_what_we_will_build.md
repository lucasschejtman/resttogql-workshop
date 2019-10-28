+++
title = "What We Will Build"
chapter = false
weight = 10
+++

### Our Goal

In this workshop, you'll change an existing app that uses REST endpoints that are served up by API-GATEWAY. This application is a simple stock trading app, the main features of this app are:

-   Allowing user sign up and authentication.

-   An API server, so our front end has a way to list stocks, load the appropriate stock prices and buy and sell stocks

-   Storing data about companies, stocks and prices as well as permissions of who can view what, so that our API has a fast and reliable place to query and save data to

### The Architecture

Here's a map of the services we'll use and how they'll all connect.

![Stocks Worshop Application](/images/architecture/Arch1.png)

### Our Tools

If you were to try and build scalable and highly-available systems to handle each of the above concerns on our own, you'd probably never get around to building our app! Fortunately, AWS provides services and tooling to handle a lot of the undifferentiated heavy lifting involved in building modern, robust applications. We'll use a number of these services and tools in our solution, including:

-   The [AWS Amplify CLI](https://github.com/aws-amplify/amplify-cli), to rapidly provision and configure our cloud services

-   The [AWS Amplify JavaScript library](https://aws-amplify.github.io/), to connect our front end to cloud resources

-   [Amazon Cognito](https://aws.amazon.com/cognito/), to handle user sign up authorization

-   [Amazon DynamoDB](https://aws.amazon.com/dynamodb/), to provide millisecond response times to API queries for Stock and Company Data

-   [AWS AppSync](https://aws.amazon.com/appsync/), to host a GraphQL API for our front end

-   [AWS Lambda](https://aws.amazon.com/lambda/), to update our stock information

-   [Amazon Elasticsearch Service](https://aws.amazon.com/elasticsearch-service/), to create a running history of stock prices

If any or all of these services are new to you, don't worry. We'll cover everything you need to know to get started using everything mentioned above. And there's no better way to learn than to build, so let's get started!
