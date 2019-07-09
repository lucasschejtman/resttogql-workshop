+++
title = "Adding Mutations"
chapter = false
weight = 1
+++

### Our Goal
The goal of this section is to continue to migrate our application, by focusing on mutations.

We will do this in the AWS console, however this is not the only way this can be done.  We can also do this using amplify.

![Stocks Worshop Application](/images/architecture/Arch3.png)

{{% notice info %}}
For more information on how to build and deploy graphql schemas with amplify can be found here [https://aws-amplify.github.io/docs/js/api#using-aws-appsync](https://aws-amplify.github.io/docs/js/api#using-aws-appsync)
{{% /notice %}}

### The Schema
Mutations are how GraphQL changes(mutates) data from the data sources its connected to. Like Queries they also connect to the data sources via resolvers which we connect to the queries.  

![Mutations](/images/mutation.png)

We have 1 muation listed here 'UpdateStock', but it uses a custom type Stock that we havent used yet - this Type is used in  the return from UpdateSock and looks like this

```tsx
type Stock {
	delta: Float!
	stock_value: Float!
}

```

Also notice that the UpdateStock mutation has a resolver assigned, designating what data source the mutation will update.

![Mutation Resolvers](/images/updateStock_mutation.png)

