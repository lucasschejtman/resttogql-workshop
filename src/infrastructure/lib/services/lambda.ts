import * as cdk from "@aws-cdk/cdk";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";

import { Function } from "../helper/functions";
import IRestToGqlStack from "../interfaces/IRestToGqlStack";

const DDB_TABLE_NAME = process.env.DDB_TABLE_NAME || "";
const DDB_NUM_COMPANIES_SEED = process.env.DDB_NUM_COMPANIES_SEED || "";

const RestToGqlFunctions = (stack: IRestToGqlStack) => {
    const scope = (stack as unknown) as cdk.Construct;

    const esEndpoint = stack.ESDomain.domainEndpoint;
    const fnRole = new iam.Role(scope, "lambda_execution_role", {
        assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        managedPolicyArns: [
            "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
            "arn:aws:iam::aws:policy/AmazonCognitoPowerUser"
        ]
    });
    fnRole.addToPolicy(
        new iam.PolicyStatement()
            .addAllResources()
            .addActions("es:ESHttpPost", "es:ESHttpPut", "es:ESHttpDelete")
    );

    const fn = Function(scope);

    const ddbToEs = fn("ddb-to-es", {
        role: fnRole,
        environment: {
            ["REGION"]: stack.Region,
            ["ES_ENDPOINT"]: esEndpoint
        }
    });

    ddbToEs.addEventSource(
        new DynamoEventSource(stack.Table, {
            startingPosition: lambda.StartingPosition.TrimHorizon
        })
    );

    const esSetup = fn("es-setup", {
        role: fnRole,
        environment: {
            ["REGION"]: stack.Region,
            ["ES_ENDPOINT"]: esEndpoint
        }
    });

    const esStockValue = fn("es-stock-value", {
        role: fnRole,
        environment: {
            ["REGION"]: stack.Region,
            ["ES_ENDPOINT"]: esEndpoint
        }
    });

    const getCompany = fn("get-company", {
        role: fnRole,
        environment: { ["DDB_TABLE_NAME"]: DDB_TABLE_NAME }
    });

    const getCompanyStock = fn("get-company-stock", {
        role: fnRole,
        environment: { ["DDB_TABLE_NAME"]: DDB_TABLE_NAME }
    });

    const listCompanies = fn("list-companies", {
        role: fnRole,
        environment: { ["DDB_TABLE_NAME"]: DDB_TABLE_NAME }
    });

    const seedDDB = fn("seed-dynamo-data", {
        role: fnRole,
        environment: {
            ["DDB_TABLE_NAME"]: DDB_TABLE_NAME,
            ["NUM_COMPANIES"]: DDB_NUM_COMPANIES_SEED
        }
    });

    const updateStock = fn("update-stock", {
        role: fnRole,
        environment: { ["DDB_TABLE_NAME"]: DDB_TABLE_NAME }
    });

    const addCognitoUser = fn("add-cognito-user", {
        role: fnRole,
        environment: {
            ["USER_POOL_ID"]: stack.Auth.userPoolId,
            ["USER_POOL_CLIENT_ID"]: stack.AuthClient.userPoolClientId
        }
    });

    stack.Functions = {
        ["es-stock-value"]: esStockValue,
        ["get-company"]: getCompany,
        ["get-company-stock"]: getCompanyStock,
        ["list-companies"]: listCompanies,
        ["update-stock"]: updateStock,
        ["es-setup"]: esSetup,
        ["seed-ddb"]: seedDDB,
        ["ddb-to-es"]: ddbToEs,
        ["add-cognito-user"]: addCognitoUser
    };

    return stack;
};

export default RestToGqlFunctions;
