+++
title = "Adding Subscriptions"
chapter = false
weight = 1
+++


### Our Goal
The goal of this section is to continue to migrate our application, by focusing on subscriptions.

We will do this in the AWS console, however this is not the only way this can be done.  We can also do this using amplify.

![Stocks Worshop Application](/images/architecture/Arch5.png)

{{% notice info %}}
For more information on how to build and deploy graphql schemas with amplify can be found here [https://aws-amplify.github.io/docs/js/api#using-aws-appsync](https://aws-amplify.github.io/docs/js/api#using-aws-appsync)
{{% /notice %}}

### Subscriptions
Subscriptions are a way of notify registered clients that a mutation has happened. This notification in performed using WebSockets and the architecture looks something like.

![Subscriptions](/images/SubsArch.png)


### The Schema
Subscriptions are registered as a type like Queries and mutations, you can see the 'onStockChange subscription below. When creating a subscription it needs a Type to send to the client(  in this case its our type 'Stock') and it needs a mutation to attach to ( in this case its attach to  the UpdateStock mutation)   

![Subscriptions](/images/subscriptions.png)

Notice that you can attach resolvers to subscriptions, this might be useful if tracking when a subscription is fired.





