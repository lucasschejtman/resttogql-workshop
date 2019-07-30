+++
title = "Subscriptions Instructions"
chapter = false
weight = 2
+++

## Our Goal

The goal of this section is to change how the Detail page updates its its displayed data. Currenly it is polls following RESTful endpoints `/companies/{id}/stock` retrieve data. We want to change this to use oue new GraphQL schema subscription that that will notify the client of any updates to stock it has registered an interest in.

### Client Changes

-   In Cloud 9 create a new folder under '/src/web/src/graphql/subscriptions.js' We will store our queries in here. Add this as an import to StockDetails.tsx

```tsx
import * as subscriptions from "./graphql/subscriptions.js";
```

-   Define our subscription - Open up the newly created subscription.js file and paste the following in.

```tsx
export const SubscribeToStock = `subscription SubscribeToStock {
  onStockChange {
    stock_value
  }
}`;
```

-   Add a new state property to store subscription - add this as part of State interface.

```tsx
stockSubscription: {
}
```

-   Add the implementation of stockSubscription you just created in the interface - add this where is defines 'state ='

```tsx
stockSubscription: {
    unsubscribe: () => {};
}
```

-   In the constructor add the following that will bind the function onStock(which we will create in a later step) to subscription updates.
    Also this is where we will register the client for the aubscription and when they occur call the onStock function.

```tsx
// Bind the function that will receive the subscription updates
this.onStock = this.onStock.bind(this);
// Initiate the AppSync subscription
this.state.stockSubscription = API.graphql(graphqlOperation(subscriptions.SubscribeToStock))
    //@ts-ignore
    .subscribe({
        next: this.onStock
    });
```

-   Implement the onStock function - should look like below

```tsx
    async onStock({ value }: any) {
        console.log("On Stock change: ", value.data);
        const newComp = {
            ...this.state.company,
            stock_value: value.data.onStockChange.stock_value
        };
        this.setState({
            company: newComp
        });
        await this.retrieveStock();
    }
```

-   Finally clean up subscription and associate web socket connection when page closes in ComponentDidUnmount function. This should now look like this.

```tsx
componentWillUnmount() {
    // Clean up the subscription connection when the component is no longer needed
    this.state.stockSubscription.unsubscribe();
    }
```

-   Thats it , you can also remove all the polling code (optional) as its not need anymore
