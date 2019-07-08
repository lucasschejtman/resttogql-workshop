+++
title = "Changing Mutations"
chapter = false
weight = 2
+++

## Our Goal
The goal of this section is to change how the Detai page loads it displayed data.   Currenly it is using the following RESTful endpoints /companies/{id}/stock .  We want to change this to use oue new GraphQL schema that we looked at in the last section.


### Client Changes
* Change the call to list companies to use the GraphQL endpoint as opposed to the rest enpoint .  The code is in the ComponentDIDMount function - after the change this function should look like below

```tsx
async componentDidMount() {
    const session = await Auth.currentSession();
        this.setState({
            authParams: {
                headers: { "Authorization": session.getIdToken().getJwtToken() },
                response: true
            }
        });
        
    const apiData = await API.graphql(graphqlOperation(queries.ListCompanies));
        //@ts-ignore
    this.setState({ itemData: apiData.data.listCompanies })
    }

```

* Add graphQLOperation to our imports, this function is part of the amplify library and is the entry point for all AppSync calls. Your Amplify imports should now look like this.

```tsx
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify';
```


* Define our first Query - Open up the newly created queries.js file and paste the following in.

```tsx
// Query that will return a list of Companies
export const ListCompanies = `query ListCompanies {
    listCompanies { 
        company_id 
        company_name
        stock_name
        stock_value
    }
}`;
```

Now if you open up the application the initial loading screen while use the GraphAPI endpoint to load the list of companies.

### Testing we are using GraphQL
You can either open the developer console on your browser and see the request to AppSync - or edit the ListCompanies Query to return less data and see how the table is then rendered


