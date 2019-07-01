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
The first thing we need to do is create a new user - go ahead and do that, the user can be verified using phone or email

{{% notice info %}}
If the verfication method isnt working for the user then simply use the cognito console, the user pool you need to go into to verify the user is called 'resttogql-userpool'
{{% /notice %}}

Once logged in you should be presented with the StocksTable page.  This page is a view that shows all the possible stocks and their most current value.

If you click on a line in the table you should then be taken to a more detailed view of that stock over time.

Go Ahead and start getting familiar with the app ( shouldn't take long :) )

Next, we'll have a look at the classes of interest.

### App 
This is the entry point to the application.


***withAuthenticator(HOC)***
Now that we have our backend set up for managing registrations and sign-in, all we have done is use the _withAuthenticator_ [higher-order React component from AWS Amplify](https://aws-amplify.github.io/amplify-js/media/authentication_guide.html#using-components-in-react) to wrap our  _App_ component. This takes care of rendering a simple UI for letting users sign up, confirm their account, sign in, sign out, or reset their password.

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


### StockDetail.tsx 
This is the screen that displays the detail of each stock, which includes history and the buy and sell actions

**Areas of Interest**