+++
title = "The Remaining Queries"
chapter = false
weight = 5
+++

### Goal

Your goal in this section is to add the remaining queries that we have defined in our schema to our client application. These queries are used by the StockDetail Page.

### Code Changes

The GetCompany Query is called from the StockDetail Page when it loads. So the first thing we need to to is change that page so it can call into GraphQL endpoint.

-   Change Imports in StockDetail Page

```tsx
//StockDetail.tsx
import { API, graphqlOperation, Auth } from "aws-amplify";
import * as queries from "./graphql/queries.js";
```

-   Change the call when the page initially loads to call the GraphQL queries instead of going directly to the REST API. We do this in the 'componentDidMount' function - it should now look like the below

```tsx
//StockDetail.tsx
async componentDidMount() {
    this.retrieveStock();
    const session = await Auth.currentSession();
    this.setState({
        authParams: {
            headers: { Authorization: session.getIdToken().getJwtToken() },
            response: true
        }
    });
    //@ts-ignore
    const { data } = await API.graphql(
        graphqlOperation(queries.GetCompany, { id: this.state.id })
        );
    this.setState({ company: data.getCompany });
    }

```

-   Add in the new queries to the queries.js file, so it looks like this

```tsx
//queries.js
// Query that will return a Company given its ID
export const GetCompany = `query GetCompany($id: Int!) {
    getCompany(id: $id){
        company_name
        company_description
        stock_value
     }
 }`;

// Query to retrieve the stock price history for a company
export const GetHistogram = `query GetHistogram($company_id: Int!, $limit: Int!) {
    stockHistogram(company_id: $company_id, limit: $limit) {
             stock_value
       }
     }`;
```

-   Update the retrieveStock function so that it loads returns the stockHistory query.

```tsx
//StockDetail.tsx
async retrieveStock() {
        //@ts-ignore
        const { data } = await API.graphql(
            graphqlOperation(queries.GetHistogram, {
                company_id: this.state.id,
                limit: 10
            })
        );
        console.log(data.stockHistogram);
        const stockData = data.stockHistogram.map((r: stockResponse) => ({
            date: "Today",
            price: Number(r.stock_value)
        }));
        this.setState({ stockData });
    }
```

{{% notice info %}}
Once you change these methods you may have a compile errors for stockValue - you can use you TS knowledge to fix or alternatively refer to the /solution/ folder in this repo
{{% /notice %}}
Hint

```tsx
//StockDetail.tsx
type stockResponse = {
    stock_value: string
}
```

### Testing we are using GraphQL and debugging

You can either:

1. Open the developer console on your browser and see the request to AppSync.  GraphQL operations are wrapped in an HTTP Post so can be seen in the developer console

2. Edit the Queries to return less data and see how the page is then rendered. To edit the queries simply change the queries.js file and change the queries to return the data that you need.
