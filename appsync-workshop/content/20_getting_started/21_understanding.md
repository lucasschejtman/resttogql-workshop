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

Next, we'll have a look at the classes of interest.

**Open src/App.tsx**  
This is the entry point to the application.

Now that we have our backend set up for managing registrations and sign-in, all we need to do is use the _withAuthenticator_ [higher-order React component from AWS Amplify](https://aws-amplify.github.io/amplify-js/media/authentication_guide.html#using-components-in-react) to wrap our existing _App_ component. This will take care of rendering a simple UI for letting users sign up, confirm their account, sign in, sign out, or reset their password.

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

**Register a User**
