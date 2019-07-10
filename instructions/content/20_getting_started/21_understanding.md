+++
title = "Understanding the application"
chapter = false
weight = 30
+++

### The login screen

If you remember, as a part of the bootstrap process, you already created a user that you can use to login.

The first screen should be presented and look like this. Use the following creadentials to authenticate (be careful, it is case sensitive).

-   Username: TestUser
-   Password: Test123!

![loging](/images/app-signin-screen.png)

{{% notice info %}}
You will see another dialog to verify the user. Don't worry about it, it has already been verified in the backend. You can just go ahead and press 'Skip'
{{% /notice %}}

![skip verification](/images/login-verification-skip.png)

{{% notice tip %}}
Amazon Cognito lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily. We just made a User Pool, which is a secure user directory that will let our users sign in with the username and password pair they create during registration. Amazon Cognito (and the Amplify CLI) also supports configuring sign-in with social identity providers, such as Facebook, Google, and Amazon, and enterprise identity providers via SAML 2.0. If you'd like to learn more, we have a lot more information on the [Amazon Cognito Developer Resources page](https://aws.amazon.com/cognito/dev-resources/) as well as the [AWS Amplify Authentication documentation.](https://aws-amplify.github.io/amplify-js/media/authentication_guide#federated-identities-social-sign-in)
{{% /notice %}}

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
If you want to learn more about the Amplify client JS libraries and the with Authenticator HOC (Higher Order Components) see
[Amplify Authentication](https://aws-amplify.github.io/docs/js/authentication)
{{% /notice %}}

{{% notice tip %}}
If you want to learn more about React Higher Order Components (HOC) see [Higher Order Components](https://reactjs.org/docs/higher-order-components.html)
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
