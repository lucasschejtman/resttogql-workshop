const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18"
});

const USER_POOL_ID = process.env.USER_POOL_ID;
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID;

const user = {
    ClientId: USER_POOL_CLIENT_ID,
    Password: "Test123!",
    Username: "TestUser",
    UserAttributes: [
        {
            Name: "email",
            Value: "test@fake.co"
        },
        {
            Name: "phone_number",
            Value: "+15555555555"
        }
    ]
};

exports.handler = async _ => {
    try {
        await cognito.signUp(user).promise();
        const confirmed = await cognito
            .adminConfirmSignUp({ UserPoolId: USER_POOL_ID, Username: user.Username })
            .promise();

        return {
            statusCode: 200,
            body: JSON.stringify(confirmed)
        };
    } catch (err) {
        console.log(err, err.stack);
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }
};
