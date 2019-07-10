import * as cdk from "@aws-cdk/cdk";
import * as cognito from "@aws-cdk/aws-cognito";

import IRestToGqlStack from "../interfaces/IRestToGqlStack";

const USER_POOL_NAME = process.env.USER_POOL_NAME || "";

const RestToGqlAuth = (stack: IRestToGqlStack) => {
    const scope = (stack as unknown) as cdk.Construct;
    const pool = new cognito.CfnUserPool(scope, USER_POOL_NAME, {
        userPoolName: USER_POOL_NAME
    });

    const poolClient = new cognito.CfnUserPoolClient(scope, "RestToGqlWebClient", {
        userPoolId: pool.userPoolId
    });

    stack.Auth = pool;
    stack.AuthClient = poolClient;

    new cdk.CfnOutput(scope, "cognito_userpool_id", {
        value: pool.userPoolId
    });
    new cdk.CfnOutput(scope, "cognito_userpool_client_id", {
        value: poolClient.userPoolClientId
    });

    return stack;
};

export default RestToGqlAuth;
