+++
title = "Changing Mutations"
chapter = false
weight = 2
+++

## Our Goal

The goal of this section is to change how the Detail page loads it displayed data. Currenly it is using the following RESTful endpoints `/companies/{id}/stock`. You want to change this to use oue new GraphQL schema that we looked at in the last section.

### Client Changes

-   In Cloud 9 create a new folder under '/src/web/src/graphql/mutations.js' We will store our queries in here. Add this as an import to StockDetails.tsx

```tsx
import * as mutations from "./graphql/mutations.js";
```

-   Change the call to update stock to use the GraphQL endpoint as opposed to the rest enpoint. The code is in the onAction() function - after the change this function should look like below

```tsx
 async onAction() {
        //@ts-ignore
        const { data } = await API.graphql(
            graphqlOperation(mutations.UpdateCompanyStock, {
                company_id: this.state.id
            })
        );
        const newComp = { ...this.state.company, stock_value: data.updateCompanyStock.stock_value };
        this.setState({
            company: newComp
        });
    }
```

-   Define your mutation - Open up the newly created mutations.js file and paste the following in.

```tsx
export const UpdateCompanyStock = `mutation UpdateCompanyStock($company_id: Int!) {
  updateCompanyStock(company_id: $company_id) {
    delta,
    stock_value
  }
}`;
```

### Testing we are using GraphQL

You can either open the developer console on your browser and see the request to AppSync - or edit the updateCompanyStock Query to return less data (value) and see how the page is then rendered
