+++
title = "Adding Subscriptions"
chapter = false
weight = 1
+++

### Our Goal

The goal of this section is to continue to migrate our application, by focusing on subscriptions.

You will do this in the AWS console, however this is not the only way this can be done. We can also do this using amplify.

![Stocks Worshop Application](/images/architecture/Arch5.png)

{{% notice info %}}
For more information on how to build and deploy graphql schemas with amplify can be found here [https://aws-amplify.github.io/docs/js/api#using-aws-appsync](https://aws-amplify.github.io/docs/js/api#using-aws-appsync)
{{% /notice %}}

### Subscriptions

Subscriptions are a way of notify registered clients that a mutation has happened. This notification in performed using WebSockets and the architecture looks something like.

![Subscriptions](/images/SubsArch.png)

### The Schema

Subscriptions are registered as a type like Queries and Mutations.

First, add your subscription to the schema

1. Open up the AWS Console
2. Go To the AppSync Service
3. Select the 'resttogql-appsync' API you created earlier
4. Select the Schema item on the left hand side
5. Add the following code that defines the subscription into the schema

```tsx
type Subscription {
	onStockChange: Stock
		@aws_subscribe(mutations: ["updateCompanyStock"])
}
```

-   Now add the mutation into the schema 'import' statement so it now looks like the below.

```tsx
schema {
	query: Query
    mutation: Mutation
  	subscription: Subscription
}
```

-   Dont forget to save your schema by selecting 'Save Schema'

When creating a subscription (onStockChange) it needs a Type to send to the client ( in this case its our type 'Stock') and it needs a mutation to attach to ( in this case its attach to the UpdateCompanyStock mutation)

Notice that you can attach resolvers to subscriptions, this might be useful if tracking when a subscription is fired. But in this example we will not
