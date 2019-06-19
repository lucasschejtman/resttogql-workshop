import * as cdk from "@aws-cdk/cdk";
import * as apigateway from "@aws-cdk/aws-apigateway";

import { cors } from "../helper/api";
import IRestToGqlStack from "../interfaces/IRestToGqlStack";

const API_GATEWAY_NAME = process.env.API_GATEWAY_NAME || "";
const API_GATEWAY_STAGE = process.env.API_GATEWAY_STAGE || "";

const RestToGqlAPI = (stack: IRestToGqlStack) => {
    const scope = (stack as unknown) as cdk.Construct;

    const api = new apigateway.RestApi(scope, API_GATEWAY_NAME, {
        restApiName: API_GATEWAY_NAME,
        deployOptions: {
            stageName: API_GATEWAY_STAGE
        }
    });
    const authorizer = new apigateway.CfnAuthorizer(scope, "RestToGqlAuthorizer", {
        authType: apigateway.AuthorizationType.Cognito,
        providerArns: [stack.Auth.userPoolArn],
        name: "RestToGql-Authorizer",
        restApiId: api.restApiId,
        identitySource: "method.request.header.Authorization",
        type: apigateway.AuthorizationType.Cognito
    });

    const fns = stack.Functions;
    const companies = api.root.addResource("company");
    cors(companies);
    companies.addMethod("GET", new apigateway.LambdaIntegration(fns["list-companies"]), {
        authorizationType: apigateway.AuthorizationType.Cognito,
        authorizerId: authorizer.authorizerId
    });

    const company = companies.addResource("{id}");
    cors(company);
    company.addMethod("GET", new apigateway.LambdaIntegration(fns["get-company"]), {
        authorizationType: apigateway.AuthorizationType.Cognito,
        authorizerId: authorizer.authorizerId
    });

    const stock = company.addResource("stock");
    cors(stock);
    stock.addMethod("GET", new apigateway.LambdaIntegration(fns["es-stock-value"]), {
        authorizationType: apigateway.AuthorizationType.Cognito,
        authorizerId: authorizer.authorizerId
    });
    stock.addMethod("PUT", new apigateway.LambdaIntegration(fns["update-stock"]), {
        authorizationType: apigateway.AuthorizationType.Cognito,
        authorizerId: authorizer.authorizerId
    });

    stack.API = api;

    new cdk.CfnOutput(scope, "apigateway_endpoint", {
        value: api.url
    });

    return stack;
};

export default RestToGqlAPI;
