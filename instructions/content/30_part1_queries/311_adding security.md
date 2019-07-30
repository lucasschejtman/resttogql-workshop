+++
title = "Adding security"
chapter = false
weight = 2
+++

### Our Goal

The goal of this section is to make sure our newly created AppSync API is fully secured.

You will do this in the AWS console, however this is not the only way this can be done.

{{% notice info %}}
For more information on all the security options in AWS Appsync you can visit [https://docs.aws.amazon.com/appsync/latest/devguide/security.html](https://docs.aws.amazon.com/appsync/latest/devguide/security.html)
{{% /notice %}}

### Adding Cognito

We are now ready to add our Cognito user pool as the authentication mechanism for our Appsync API.

Navigate to AppSync and go to the security section:

1. Open up the AWS Console
2. Go to the AppSync Service
3. Select your API
4. Click 'Settings' on the right hand side menu
5. Scroll down to the 'Default Authentication Mode' section
6. Populate the values based on your resources

![AppSync Security Link](/images/appsync-settings-link.png)
![AppSync Authentication Mode](/images/appsync-authentication-mode.png)

Scroll down to the bottom and hit 'Save'
