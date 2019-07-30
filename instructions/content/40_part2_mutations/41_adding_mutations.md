+++
title = "Adding Mutations"
chapter = false
weight = 1
+++

### Our Goal

The goal of this section is to continue to migrate our application, by focusing on mutations.

You will do this in the AWS console, however this is not the only way this can be done. We can also do this using amplify.

![Stocks Worshop Application](/images/architecture/Arch3.png)

{{% notice info %}}
For more information on how to build and deploy graphql schemas with amplify can be found here [https://aws-amplify.github.io/docs/js/api#using-aws-appsync](https://aws-amplify.github.io/docs/js/api#using-aws-appsync)
{{% /notice %}}

### The Schema

Mutations are how GraphQL changes(mutates) data from the data sources its connected to. Like Queries they also connect to the data sources via resolvers which we connect to the queries.

First lets add our mutation to our schema

1. Open up the AWS Console
2. Go To the AppSync Service
3. Select the 'resttogql-appsync' API you created earlier
4. Select the Schema item on the left hand side
5. Add the following code that defines the mutation into the schema

```tsx
type Mutation {
	updateCompanyStock(company_id: Int!): Stock
}

```

-   Now add the mutation into the schema 'import' statement so it now looks like the below.

```tsx
schema {
	query: Query
  mutation: Mutation
}
```

-   Dont forget to save your schema by selecting 'Save Schema'

### Attaching a resolver

UpdateCompanyStock mutation now needs a resolver assigned, designating what data source the mutation will update. For this we will use a lambda resolver

#### Create the datasource

In AppSync select 'Data Sources' on the left hand side, you should see the other sources we have just created - lets add a new one.

-   Select 'Create Datasource'

Fill out the field as shown below and select 'Create'

![lambda data source](/images/lambda_data_source.png)
{{% notice info %}}
If you cant find the Lambda Function 'update-stock' make sure you are selected the same region as the CDK script was deployed into previously
{{% /notice %}}

##### Mapping Templates

Now we have the data source for this mutation, lets add the resolver and its mapping templates.

-   Navigate back to you schema and select 'Attach' to attach the datasource to the updateCompanyStock mutation.

-   Select 'UPDATE_LAMBDA' as the Data Source Name.

-   Fill in the following for the mapping templates.

Request Mapping

```tsx
{
    "version" : "2017-02-28",
    "operation": "Invoke",
    "payload": {
    	"pathParameters": {
        	"id": "${context.args.company_id}"
        }
    }
}
```

Response Mapping

```tsx
$util.toJson($util.parseJson($ctx.result.body).Attributes);
```

-   Dont forget to SAVE your resolver !! by select 'Save Resolver' in the top right.

### Completed

Once completed your resolver list should look like the following

![Mutation Resolvers](/images/updateStock_mutation.png)
