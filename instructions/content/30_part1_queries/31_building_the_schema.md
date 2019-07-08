+++
title = "Building The Schema"
chapter = false
weight = 1
+++

### Our Goal
The goal of this section is to start building the GraphQL schema that will service the application.

We will do this in the AWS console, however this is not the only way this can be done.  We can also do this using amplify.

![Stocks Worshop Application](/images/architecture/Arch2.png)


{{% notice info %}}
For more information on how to build and deploy graphql schemas with amplify can be found here [https://aws-amplify.github.io/docs/js/api#using-aws-appsync](https://aws-amplify.github.io/docs/js/api#using-aws-appsync)
{{% /notice %}}

### Know your Domain
Before building a GraphQL schema its important to know the Domain Model you are trying to model first.  This helps when building out you schema.  For our domain we are using the very simple one as shown

![Stocks Domain](/images/DataModel.png)


### The Schema

Next we will look at our Schema and explain the various elements.

Navigate to AppSync and open up the scehma browser:

1. Open up the AWS Console
2. Go To the AppSync Service
3. On the Left Hand Side select Schema

You will see the following
![Stocks Schema](/images/Schema.png)

{{% notice info %}}
For more information how to build schemas see: [https://docs.aws.amazon.com/appsync/latest/devguide/designing-your-schema.html#aws-appsync-designing-your-schema](https://docs.aws.amazon.com/appsync/latest/devguide/designing-your-schema.html#aws-appsync-designing-your-schema)
{{% /notice %}}


### Understanding the Schema

The schema is split into a number of distinct parts, for this excercise we will concentrate on the parts that affect queries. We will address the rest of the schema in later sections of the workshop

### Types
Types are GraphQL objects and define the data, GraphQL has native types and allows us to define our own. For this workshop we have modelled our domain into the Company Type shown below

![Company Type](/images/CompanyType.png)

{{% notice info %}}
For more information on Types [https://graphql.org/learn/schema/](https://graphql.org/learn/schema/)
{{% /notice %}}

### Queries

Queries are how GraphQL retrieves data from the data sources its connected to.  It connects to these data sources via resolvers which we connect to the queries.  

![Queries](/images/Queries.png)

We have 3 queries listed here :

```tsx
getCompany(id: Int!): Company
listCompanies: [Company]
stockHistogram(company_id: Int!, limit: Int!): [Stock]

```

Each of these Queries are connected to a resolver which in turn connects to an underlying data source.  


### Resolvers
Resolvers are the mechanisn that connects AppSync to the underlying datasources that your schema needs.  We can get access to the resolvers in the Schema screen (they are on the right hand side)

Scroll down until you see the 3 resolvers that are attached to our three Queries. It should look like the capture below

![Queries](/images/resolvers.png)

Click into one of the resolvers to see how they work - lets choose the first one we will build out 'listCompanies' , click on EXISTING_API to look at our first resolver which is a resolver into APU_GATEWAY.

Resolver have 3 parts 

1. The Datasource
2. The Request Mapping Template
3. The Response Mapping Template

#### The Data Source
This defines what data source we are reaching into 

{{% notice info %}}
For more information on Data sources and how to attach to resolvers [https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-http-resolvers.html](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-http-resolvers.html)
{{% /notice %}}


#### Mapping Templates
Mapping templates are used to tranform the Request/Response that AppSync generates for the resolver into a format that the underlying data source of the resolver will under stand.  For AppSync these templates are written in Apache Velocity 
[https://velocity.apache.org/](https://velocity.apache.org/)

##### Request Template
Looks like the one should below - it is mapping the request into the REST endpoint resource /company passing any params and AUTH_HEADERS in the original request through to the API.

```vtl
{
    "version": "2018-05-29",
    "method": "GET", 
    "resourcePath": "/prod/company",
    "params":{
        "query":$util.toJson($ctx.args),
        "headers": {
            "Authorization": "$ctx.request.headers.Authorization"
        }
    }
}

```

##### Response Template
The response template is even simpler - it parses the response from the underlying datasource (API_GATEWAY) and puts it in an array of items

```vtl
$util.toJson(
  $util.parseJson(
  	$ctx.result.body
  ).Items
)
```
{{% notice info %}}
For more information on Configuring resolvers [https://docs.aws.amazon.com/appsync/latest/devguide/configuring-resolvers.html](https://docs.aws.amazon.com/appsync/latest/devguide/configuring-resolvers.html)
{{% /notice %}}










