import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as appsync from "@aws-cdk/aws-appsync";
import * as path from "path";
import { readFileSync } from "fs";

import IRestToGqlStack from "../interfaces/IRestToGqlStack";
import { ManagedPolicy } from "@aws-cdk/aws-iam";

const BASE_DIR = "server/graphql";
const APPSYNC_NAME = process.env.APPSYNC_NAME || "";

const gqlPath = (folder: string) => path.join("..", BASE_DIR, folder);
const template = (tmplPath: string) => readFileSync(tmplPath).toString();
const resolverPath = gqlPath("resolvers");
const requestTemplate = (resolver: string) =>
    template(path.join(resolverPath, resolver, "request.vtl"));
const responseTemplate = (resolver: string) =>
    template(path.join(resolverPath, resolver, "response.vtl"));

const buildApi = (scope: cdk.Construct, userPoolId: string, region: string) => {
    const api = new appsync.CfnGraphQLApi(scope, "RestToGqlAppSync", {
        authenticationType: "AMAZON_COGNITO_USER_POOLS",
        userPoolConfig: {
            awsRegion: region,
            defaultAction: "ALLOW",
            userPoolId: userPoolId
        },
        name: APPSYNC_NAME
    });

    return api;
};

const buildSchema = (scope: cdk.Construct, apiId: string) => {
    const schemaPath = path.join("..", BASE_DIR, "schema.gql");
    const schema = new appsync.CfnGraphQLSchema(scope, "RestToGqlAppSyncSchema", {
        apiId: apiId,
        definition: template(schemaPath)
    });

    return schema;
};

const buildRole = (scope: cdk.Construct) => {
    const fnRole = new iam.Role(scope, "appsync_execution_role", {
        assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
        managedPolicies: [
            ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"),
            ManagedPolicy.fromAwsManagedPolicyName("AWSLambdaFullAccess")
        ]
    });

    const esPolicy = new iam.PolicyStatement();
    esPolicy.addAllResources();
    esPolicy.addActions("es:ESHttpPost", "es:ESHttpPut", "es:ESHttpDelete");
    fnRole.addToPolicy(esPolicy);

    return fnRole;
};

const buildDDBSource = (
    scope: cdk.Construct,
    apiId: string,
    tableName: string,
    roleArn: string,
    region: string
) => {
    const ddbSource = new appsync.CfnDataSource(scope, "DynamoDataSource", {
        apiId: apiId,
        name: "DYNAMO_DB",
        type: "AMAZON_DYNAMODB",
        dynamoDbConfig: {
            awsRegion: region,
            tableName: tableName
        },
        serviceRoleArn: roleArn
    });

    return ddbSource;
};

const buildESSource = (
    scope: cdk.Construct,
    apiId: string,
    domainEndpoint: string,
    roleArn: string,
    region: string
) => {
    const esSource = new appsync.CfnDataSource(scope, "ESDataSource", {
        apiId: apiId,
        name: "ELASTIC_SEARCH",
        type: "AMAZON_ELASTICSEARCH",
        elasticsearchConfig: {
            awsRegion: region,
            endpoint: `https://${domainEndpoint}`
        },
        serviceRoleArn: roleArn
    });

    return esSource;
};

const buildHTTPSource = (scope: cdk.Construct, apiId: string, url: string) => {
    const httpSource = new appsync.CfnDataSource(scope, "HTTPDataSource", {
        apiId: apiId,
        name: "EXISTING_API",
        type: "HTTP",
        httpConfig: {
            endpoint: url
        }
    });

    return httpSource;
};

const buildLambdaSource = (scope: cdk.Construct, apiId: string, fnArn: string, roleArn: string) => {
    const lambdaSource = new appsync.CfnDataSource(scope, "LambdaDataSource", {
        apiId: apiId,
        name: "UPDATE_LAMBDA",
        type: "AWS_LAMBDA",
        lambdaConfig: {
            lambdaFunctionArn: fnArn
        },
        serviceRoleArn: roleArn
    });

    return lambdaSource;
};

const buildDDBResolver = (scope: cdk.Construct, apiId: string, source: appsync.CfnDataSource, schema: appsync.CfnGraphQLSchema) => {
    const DDBResolver = new appsync.CfnResolver(scope, "DDBResolver", {
        apiId: apiId,
        dataSourceName: source.name,
        typeName: "Query",
        fieldName: "getCompany",
        requestMappingTemplate: requestTemplate("getCompany"),
        responseMappingTemplate: responseTemplate("getCompany")
    });
    DDBResolver.addDependsOn(schema);
    DDBResolver.addDependsOn(source);
};

const buildESResolver = (scope: cdk.Construct, apiId: string, source: appsync.CfnDataSource, schema: appsync.CfnGraphQLSchema) => {
    const ESResolver = new appsync.CfnResolver(scope, "ESResolver", {
        apiId: apiId,
        dataSourceName: source.name,
        typeName: "Query",
        fieldName: "stockHistogram",
        requestMappingTemplate: requestTemplate("stockHistogram"),
        responseMappingTemplate: responseTemplate("stockHistogram")
    });
    ESResolver.addDependsOn(schema);
    ESResolver.addDependsOn(source);
};

const buildHTTPResolver = (scope: cdk.Construct, apiId: string, source: appsync.CfnDataSource, schema: appsync.CfnGraphQLSchema) => {
    const HTTPResolver = new appsync.CfnResolver(scope, "HTTPResolver", {
        apiId: apiId,
        dataSourceName: source.name,
        typeName: "Query",
        fieldName: "listCompanies",
        requestMappingTemplate: requestTemplate("listCompanies"),
        responseMappingTemplate: responseTemplate("listCompanies")
    });
    HTTPResolver.addDependsOn(schema);
    HTTPResolver.addDependsOn(source);
};

const buildLambdaResolver = (scope: cdk.Construct, apiId: string, source: appsync.CfnDataSource, schema: appsync.CfnGraphQLSchema) => {
    const LambdaResolver = new appsync.CfnResolver(scope, "LambdaResolver", {
        apiId: apiId,
        dataSourceName: source.name,
        typeName: "Mutation",
        fieldName: "updateCompanyStock",
        requestMappingTemplate: requestTemplate("updateCompanyStock"),
        responseMappingTemplate: responseTemplate("updateCompanyStock")
    });
    LambdaResolver.addDependsOn(schema);
    LambdaResolver.addDependsOn(source);
};

const RestToGqlAppSync = (stack: IRestToGqlStack) => {
    const region = stack.Region;
    const scope = (stack as unknown) as cdk.Construct;

    // API
    const api = buildApi(scope, stack.Auth.userPoolId, region);
    const apiId = api.attrApiId;

    // Schema
    const schema = buildSchema(scope, apiId);

    // Data Sources
    const role = buildRole(scope);
    const ddbSource = buildDDBSource(scope, apiId, stack.Table.tableName, role.roleArn, region);
    const esSource = buildESSource(
        scope,
        apiId,
        stack.ESDomain.attrDomainEndpoint,
        role.roleArn,
        region
    );
    const httpSource = buildHTTPSource(scope, apiId, stack.API.url);
    const lambdaSource = buildLambdaSource(
        scope,
        apiId,
        stack.Functions["update-stock"].functionArn,
        role.roleArn
    );

    // Resolvers
    buildDDBResolver(scope, apiId, ddbSource, schema);
    buildESResolver(scope, apiId, esSource, schema);
    buildHTTPResolver(scope, apiId, httpSource, schema);
    buildLambdaResolver(scope, apiId, lambdaSource, schema);

    stack.AppSync = api;

    new cdk.CfnOutput(scope, "appsync_endpoint", {
        value: api.attrGraphQlUrl
    });

    return stack;
};

export default RestToGqlAppSync;
