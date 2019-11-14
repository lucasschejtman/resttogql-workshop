+++
title = "List Companies Query"
chapter = false
weight = 4
+++

## Our Goal

Now we are familiar with the GraphQL Schema and how we can define our Types, Resolvers and start testing our queries. Now lets use the ListCompanies query and call it from the client.

### Why start with List Companies ?

When the application starts up, it currently calls the API-Gateway endpoint `/companies`. This will pull ALL the companies and ALL of their associated data from your DynamoDB database, this over-fetching can impact the application performance. By facading this call behind AppSync we can hide any changes to the API-Gateway from the client and control how much data is returned to the client on each call.

### Client Changes

Lets go back to our application and enable the GraphQL endpoint.

-   Open up .env file and make sure the following line is uncommented and the correct endpoint is output

```bash
REACT_APP_APPSYNC_ENDPOINT=[Your AppSync Endpoint]
```

{{% notice info %}}
To get the value, you can goto the Settings page of your AppSync service
![GraphAPI Details](/images/GraphAPIDetails.png)
{{% /notice %}}

-   Update your Amplify configure code to use this endpoint. These changes are made to StockTable.tsx. Change the Amplify Configure code to look like below - we are pulling in the Auth Header and adding the endpoint

```tsx
//StockTable.tsx
Amplify.configure({
    Auth: {
        region: process.env.REACT_APP_DEFAULT_REGION,
        userPoolId: process.env.REACT_APP_COGNITO_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_COGNITO_POOL_CLIENT_ID
    },
    API: {
        endpoints: [
            {
                name: API_NAME,
                endpoint: process.env.REACT_APP_API_ENDPOINT,
                region: process.env.REACT_APP_DEFAULT_REGION
            }
        ],
        graphql_headers: async () => ({
            Authorization: (await Auth.currentSession()).getIdToken().getJwtToken()
        }),
        aws_appsync_region: process.env.REACT_APP_DEFAULT_REGION,
        aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
        aws_appsync_graphqlEndpoint: process.env.REACT_APP_APPSYNC_ENDPOINT
    }
});
```

-   In Cloud 9 create a new file in a new folder with path '/src/web/src/graphql/queries.js' This is so we have a single point to store our queries. Once the file is created we will then add this as an import statement to StockTable.tsx

-   Define our first Query - Open up the newly created queries.js file and paste the following in.

```tsx
// queries.js
// Query that will return a list of Companies
export const ListCompanies = `query ListCompanies {
    listCompanies { 
        company_id 
        company_name
        stock_name
        stock_value
    }
}`;
```
### StockTable.tsx 

Import our new file.

```tsx
//StockTable.tsx
import * as queries from "./graphql/queries.js";
```

- Change the call to list companies to use the GraphQL endpoint as opposed to the rest endpoint . The code is in the ComponentDIDMount function - after the change this function should look like below

```tsx
// StockTable.tsx
async componentDidMount() {
    const session = await Auth.currentSession();
        this.setState({
            authParams: {
                headers: { "Authorization": session.getIdToken().getJwtToken() },
                response: true
            }
        });

    const apiData = await API.graphql(graphqlOperation(queries.ListCompanies));
        //@ts-ignore
    this.setState({ itemData: apiData.data.listCompanies })
    }

```

-   Add graphQLOperation to our imports, this function is part of the amplify library and is the entry point for all AppSync calls. Your Amplify imports should now look like this.

```tsx
//StockTable.tsx
import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
```

Now if you open up the application the initial loading screen while use the GraphAPI endpoint to load the list of companies.

### Testing we are using GraphQL

You can either open the developer console in your favourite browser and see the request being sent to AppSync [should be able to see the POST body container the query being sent] - or edit the ListCompanies Query in the queries.js file to return less data and see how the table is then rendered
