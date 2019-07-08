+++
title = "List Companies Query"
chapter = false
weight = 3
+++

## Our Goal
Now we are familiar with the GraphQL Schema and how we can define our Types, Resolvers and start testing our queries.  Now lets use the ListCompanies query and call it from the client.  

### Why start with List Companies ?
When the application starts up, it currently calls the APIGW endpoint /companies.  This will pull ALL the companies and ALL of their associated data from our DynamoDB database and this over fetching can impact application performance.  By facading this call behind appsync we can hide any changes to the API-Gateway from the client and control how much data is returned to the client on each call.

### Client Changes
Lets go back to our application and enable the GraphQL endpoint.

1. Open up .env file and make sure the following line is uncommented and the correct endpoint is output ( to get the endpoint value you can )
```bash
REACT_APP_APPSYNC_ENDPOINT=[Your AppSync Endpoint]
```

