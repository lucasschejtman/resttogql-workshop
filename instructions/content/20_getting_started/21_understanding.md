+++
title = "Understanding the application"
chapter = false
weight = 30
+++

### The login screen

The first screen should be presented and look like this

![loging](/images/app-signin-screen.png)

{{% notice tip %}}
Amazon Cognito lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily. We just made a User Pool, which is a secure user directory that will let our users sign in with the username and password pair they create during registration. Amazon Cognito (and the Amplify CLI) also supports configuring sign-in with social identity providers, such as Facebook, Google, and Amazon, and enterprise identity providers via SAML 2.0. If you'd like to learn more, we have a lot more information on the [Amazon Cognito Developer Resources page](https://aws.amazon.com/cognito/dev-resources/) as well as the [AWS Amplify Authentication documentation.](https://aws-amplify.github.io/amplify-js/media/authentication_guide#federated-identities-social-sign-in)
{{% /notice %}}

### Creating a User

The first thing we need to do is create a new user - go ahead and do that by selecting 'create account', the user can be verified using phone or email.

{{% notice info %}}
User password needs 1 upper, a symbol and a min length of 8

If the verfication method is failing (email or phone verificatin message isnt delivered) then simply use the cognito console. {{% /notice %}}

1. Login to AWS console
2. Navigate to the Cognito service
3. Select 'Manage User Pools'
4. Select the 'resttogql-userpool'
5. Select 'Users and Groups' -> click on the user you just created
6. Click 'Confirm User'

{{% notice info %}}
You can now login with this user to the app - you can skip any further verfication flow dialogs
{{% /notice %}}

Once logged in you should be presented with the StocksTable page. This page is a view that shows all the possible stocks and their most current value.

{{% notice info %}}
Before we're ready to go, you will need to finish the bootstrapping process by running the setup step function that was deployed with the same, using the steps below
{{% /notice %}}

1. Login to AWS console
2. Navigate to the Step Function service
3. Select the function - name should start with 'StateMachine'
4. Select 'Start Execution' and then 'Start Execution'
5. Once execution is finished, Navigate back into your app and refresh the page

{{% notice info %}}
You should now see a list of random stocks:
![StocksList](/images/StocksList.png)

{{% /notice %}}

If you click on a line in the table you should then be taken to a more detailed view of that stock over time.

Go Ahead and start getting familiar with the app ( shouldn't take long :) )

Next, we'll have a look at the classes of interest.

### App

This is the entry point to the application.

**_withAuthenticator(HOC)_**
Now that we have our backend set up for managing registrations and sign-in, all we have done is use the _withAuthenticator_ [higher-order React component from AWS Amplify](https://aws-amplify.github.io/amplify-js/media/authentication_guide.html#using-components-in-react) to wrap our _App_ component. This takes care of rendering a simple UI for letting users sign up, confirm their account, sign in, sign out, or reset their password.

```tsx
// src/App.tsx

import Amplify from "aws-amplify";
//@ts-ignore
import { withAuthenticator } from "aws-amplify-react";
import React, { Component } from "react";

import StockTable from "./StockTable";

require("dotenv").config();

class App extends Component {
    render() {
        return <StockTable />;
    }
}

export default withAuthenticator(App, false);
```

### Things to note in App.tsx

-   Imported and configured the AWS Amplify JS library

-   Imported the withAuthenticator higher order component from aws-amplify-react

-   Wrapped the App component using withAuthenticator

{{% notice tip %}}
If you want to learn more about the Amplify client JS libraries and the with Authenticator HOC( Higher Order Components ) see
[Amplify Authentication](https://aws-amplify.github.io/docs/js/authentication)
{{% /notice %}}

### StockTable.tsx

This is the screen that initially presents after login.

**Areas of Interest**

The call to the API to retrieve a list of companies

```tsx
async componentDidMount() {
        const session = await Auth.currentSession();
        this.setState({
            authParams: {
                headers: { Authorization: session.getIdToken().getJwtToken() },
                response: true
            }
        });

        const { data } = await API.get(API_NAME, "/company", this.state.authParams);
        this.setState({ itemData: data.Items });
    }

```

### StockDetail.tsx

This is the screen that displays the detail of each stock, which includes history and the buy and sell actions

**Areas of Interest**

```tsx

 async retrieveStock() {
        const res = await API.get('companies', `/company/${this.state.id}/stock`, this.state.authParams);
        const stockData = res.data.map((r: stockResponse) => ({ data: 'Today', price: Number(r._source.stockValue) }));
        this.setState({ stockData });
    }
```

Get the Current Stock price for the selected Company
( this code is also called by the AutoRefresh Button)
