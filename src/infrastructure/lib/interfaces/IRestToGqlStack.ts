import * as elasticsearch from "@aws-cdk/aws-elasticsearch";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as cognito from "@aws-cdk/aws-cognito";
import * as appsync from "@aws-cdk/aws-appsync";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as stepfunctions from "@aws-cdk/aws-stepfunctions";

import IRestToGqlFunctions from "./IRestToGqlFunctions";

export default interface IRestToGqlStack {
    Region: string;
    API: apigateway.RestApi;
    ESDomain: elasticsearch.CfnDomain;
    Table: dynamodb.Table;
    Functions: IRestToGqlFunctions;
    Auth: cognito.CfnUserPool;
    AuthClient: cognito.CfnUserPoolClient;
    AppSync: appsync.CfnGraphQLApi;
    Orchestration: stepfunctions.StateMachine;
}
