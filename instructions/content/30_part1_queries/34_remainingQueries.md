+++
title = "The Remaining Queries"
chapter = false
weight = 4
+++

### Goal
Our goal in this section is to add the remaining queries that we have defined in our schema to our client application. These queries are used by the StockDetail Page.

### Code Changes 
The GetCompany Query is called from the StockDetail Page when it loads. So the first thing we need to to is change that page so it can call into GraphQL endpoint.

* Change Imports in StockDetail Page 

```tsx

import { API, graphqlOperation, Auth } from "aws-amplify";
import * as queries from "./graphql/queries.js";

```

* Change the call when the page initially loads to call the GraphQL queries instead of going directly to the REST API. We do this in the 'componentDidMount' function - it should now look like the below

```tsx

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

* Update the retrieveStock function so that it loads returns the stockHistory query.


```tsx
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

### Testing we are using GraphQL
You can either open the developer console on your browser and see the request to AppSync - or edit the Queries to return less data and see how the page is then rendered



