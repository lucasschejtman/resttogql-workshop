+++
title = "Building The Schema"
chapter = false
weight = 1
+++

### Our Goal

The goal of this section is to start building the GraphQL schema that will service the application.

We will do this in the AWS console, however this is not the only way this can be done. We can also do this using amplify.

![Stocks Worshop Application](/images/architecture/Arch2.png)

{{% notice info %}}
For more information on how to build and deploy graphql schemas with amplify can be found here [https://aws-amplify.github.io/docs/js/api#using-aws-appsync](https://aws-amplify.github.io/docs/js/api#using-aws-appsync)
{{% /notice %}}

### Know your Domain

Before building a GraphQL schema its important to know the Domain Model you are trying to model first. This helps when building out you schema. For our domain we are using the very simple one as shown

![Stocks Domain](/images/DataModel.png)

### The Schema

Next we will look at our Schema and explain the various elements.

Navigate to AppSync and open up the schema browser:

1. Open up the AWS Console
2. Go To the AppSync Service
3. Select Create API
4. For this workshop we will build an API from scratch, so select 'Build from Scratch' radio button and select 'Start'
5. Give your API a name 'resttogql-appsync'
6. Select Edit Schema and let start building

{{% notice info %}}
For more information how to build schemas see: [https://docs.aws.amazon.com/appsync/latest/devguide/designing-your-schema.html#aws-appsync-designing-your-schema](https://docs.aws.amazon.com/appsync/latest/devguide/designing-your-schema.html#aws-appsync-designing-your-schema)
{{% /notice %}}

### Understanding the Schema

The schema is split into a number of distinct parts, for this excercise we will concentrate on the parts that affect queries. We will address the rest of the schema in later sections of the workshop

### Types

Types are GraphQL objects and define the data, GraphQL has native types and allows us to define our own. For this workshop we have modelled our domain into the Company and Stock Types shown below. Copy the following into the schemas areas to add the Company and Stock Types.

```tsx
type Company {
	company_id: Int!
	company_name: String
	company_description: String
	stock_name: String
	stock_value: Float
	delta: Float
}

type Stock {
	delta: Float!
	stock_value: Float!
}
```

{{% notice info %}}
For more information on Types [https://graphql.org/learn/schema/](https://graphql.org/learn/schema/)
{{% /notice %}}

### Queries

Queries are how GraphQL retrieves data from the data sources its connected to. It connects to these data sources via resolvers which we will create later.

We have 3 queries listed here :

```tsx
type Query {
	getCompany(id: Int!): Company
	listCompanies: [Company]
	stockHistogram(company_id: Int!, limit: Int!): [Stock]
}
```

-   Copy and paste them into your new schema under the Company Type.

Finally you need to add these into the new schema, using the 'schema' construct - this is like an import for a GraphQL schema and looks like below:

```tsx
schema {
	query: Query
}
```

**Save the schema**

![save schema](/images/save_schema.png)

We have now built the schema for your endpoint, the next step is to attach some resolvers to pull data from the existing data sources.

### Resolvers

Resolver have 3 parts

1. The Datasource
2. The Request Mapping Template
3. The Response Mapping Template

Resolvers are the mechanisn that connects AppSync to the underlying datasources that your schema needs. You can get access to the resolvers in the Schema screen (they are on the right hand side)

You should see there all the types you created in the last section ( if you cant, save your schema ). Scroll down and and find the listCompanies Query, there should be an 'Attach' button beside it. Select this button

You will now be prompted to attach the datasource for this resolver - as we dont have any yet lets create one.

#### Attaching a datasource

This defines what data source we are reaching into

{{% notice info %}}
For more information on Data sources and how to attach to resolvers [https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-http-resolvers.html](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-http-resolvers.html)
{{% /notice %}}

-   Select 'Add Datasource'

Fill out the resulting screen so it looks like below

![new data source](/images/create_data_source.png)

-   Select 'Create'

So you have now created our data source, you can now go back and finish the resolver for the listCompanies query.

-   Go Back to your schema, on the right hand side find your 'listCompanies' Query and select 'Attach' and select the EXISTING_API as the data source. You should now see some pre-populated mapping templates for your resolver.

Now lets change the mapping templates that have been created for our resolver

#### Mapping Templates

Mapping templates are used to tranform the Request/Response that AppSync generates for the resolver into a format that the underlying data source of the resolver will under stand. For AppSync these templates are written in Apache Velocity
[https://velocity.apache.org/](https://velocity.apache.org/)

##### Request Template

Is mapping the request into the REST endpoint resource /company passing any params and AUTH_HEADERS in the original request through to the API.

-   Copy the following into the Request Mapping field (replace everything thats there)

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

-   Copy the following into the Request Mapping field (replace everything thats there)

```vtl
$util.toJson(
  $util.parseJson(
  	$ctx.result.body
  ).Items
)
```

-   Dont forget to SAVE your resolver !! by select 'Save Resolver' in the top right.

{{% notice info %}}
For more information on Configuring resolvers [https://docs.aws.amazon.com/appsync/latest/devguide/configuring-resolvers.html](https://docs.aws.amazon.com/appsync/latest/devguide/configuring-resolvers.html)
{{% /notice %}}

### Attach the remaining resolvers

Now you can add resolvers to the getCompany and listHistogram Queries.

#### GetCompany Query Resolver

##### DataSource

The getCompany query has a resolver into a DynamoDB table. Go ahead and create the Dynamo DataSource for this resolver first.

In AppSync select 'Data Sources' on the left hand side, you should see the EXISTING_API source we have just created - lets add a new one.

-   Select 'Create Datasource'

Fill out the field as shown below and select 'Create'

{{% notice info %}}
If you cant find the DynamoDB Table 'resttogql-company-table' make sure you are selected the same region as the CDK script was deployed into previously
{{% /notice %}}

![DynamoDB data source](/images/dynamo_datasource.png)

##### Mapping Templates

Now we have the data source for this query, lets add the resolver and its mapping templates.

-   Navigate back to you schema and select 'Attach' to attach the datasource to the GetCompany Query.

-   Select 'AMAZON_DYNAMODB' as the Data Source Name.

-   Fill in the following for the mapping templates.

Request Mapping

```tsx
{
    "version": "2017-02-28",
    "operation": "GetItem",
    "key": {
        "company_id": $util.dynamodb.toDynamoDBJson($ctx.args.id),
    }
}

```

Response Mapping

```tsx
$util.toJson($ctx.result);
```

-   Dont forget to SAVE your resolver !! by select 'Save Resolver' in the top right.

#### StockHistogram Query Resolver

##### DataSource

The StockHistogram query has a resolver into a ElasticSearch table. Lets create the ElasticSearch DataSource for this resolver first.

In AppSync select 'Data Sources' on the left hand side, you should see the EXISTING_API and AMAZON_DYNAMODB sources we have just created - add a new one.

-   Select 'Create Datasource'

Fill out the field as shown below and select 'Create'

{{% notice info %}}
If you can't find the ElasticSearch Domain 'resttogpl-company-domain' make sure you are selected the same region as the CDK script was deployed into previously
{{% /notice %}}

![Elastic Search data source](/images/ElasticSearch_datasource.png)

##### Mapping Templates

Now we have the data source for this query, lets add the resolver and its mapping templates.

-   Navigate back to you schema and select 'Attach' to attach the datasource to the StockHistory Query.

-   Select 'ELASTIC_SEARCH' as the Data Source Name.

-   Fill in the following for the mapping templates.

Request Mapping

```tsx
{
  "version":"2017-02-28",
  "operation":"POST",
  "path":"/stocks/_search?size=0",
  "params":{
    "body": {
      "aggs": {
        "top_tags": {
            "filter": {
              "term": { "companyId": $context.args.company_id }
            },
            "aggs": {
              "latest_stock_prices": {
                "top_hits": {
                  "sort": [
                    {
                      "timestamp": {
                        "order": "desc"
                      }
                    }
                  ],
                  "_source": {
                    "includes": [ "companyId", "stockValue", "delta" ]
                  },
                  "size" : $context.args.limit
                }
              }
            }
          }
        }
      }
    }
  }
}
```

Response Mapping

```tsx
#set($array = [])

#foreach($entry in $context.result.aggregations.top_tags.latest_stock_prices.hits.hits)
	$util.qr(
      $array.add(
      	$util.toJson({ "stock_value": $entry.get("_source").stockValue })
      )
    )
#end

$array
```

-   Dont forget to SAVE your resolver !! by select 'Save Resolver' in the top right.

### Completed

Once completed your resolver list should look like the following

![Queries](/images/resolvers.png)
