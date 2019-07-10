import * as cdk from "@aws-cdk/cdk";
import * as elasticsearch from "@aws-cdk/aws-elasticsearch";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as cognito from "@aws-cdk/aws-cognito";
import * as appsync from "@aws-cdk/aws-appsync";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as stepfunctions from "@aws-cdk/aws-stepfunctions";
import * as dotenv from "dotenv";

dotenv.config();

import IRestToGqlFunctions from "./interfaces/IRestToGqlFunctions";
import IRestToGqlStack from "./interfaces/IRestToGqlStack";

import RestToGqlTable from "./services/dynamo";
import RestToGqlES from "./services/elasticsearch";
import RestToGqlFunctions from "./services/lambda";
import RestToGqlAPI from "./services/apigateway";
import RestToGqlAuth from "./services/cognito";
import RestToGqlAppSync from "./services/appsync";
import RestToGqlOrchestration from "./services/stepfunctions";

const compose = <T>(fn1: (a: T) => T, ...fns: Array<(a: T) => T>) =>
    fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);

export class RestToGqlInfrastructureStack extends cdk.Stack implements IRestToGqlStack {
    private _api: apigateway.RestApi;
    private _region: string;
    private _esDomain: elasticsearch.CfnDomain;
    private _table: dynamodb.Table;
    private _functions: IRestToGqlFunctions;
    private _auth: cognito.CfnUserPool;
    private _authClient: cognito.CfnUserPoolClient;
    private _appSync: appsync.CfnGraphQLApi;
    private _orchestration: stepfunctions.StateMachine;

    get Region() {
        return this._region;
    }

    set API(val) {
        this._api = val;
    }

    get API() {
        return this._api;
    }

    set Auth(val) {
        this._auth = val;
    }

    get Auth() {
        return this._auth;
    }

    set AuthClient(val) {
        this._authClient = val;
    }

    get AuthClient() {
        return this._authClient;
    }

    set Table(val) {
        this._table = val;
    }

    get Table() {
        return this._table;
    }

    set ESDomain(val) {
        this._esDomain = val;
    }

    get ESDomain() {
        return this._esDomain;
    }

    set AppSync(val) {
        this._appSync = val;
    }

    get AppSync() {
        return this._appSync;
    }

    set Functions(val) {
        this._functions = val;
    }

    get Functions() {
        return this._functions;
    }

    set Orchestration(val) {
        this._orchestration = val;
    }

    get Orchestration() {
        return this._orchestration;
    }

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this._region = scope.node.tryGetContext("aws:cdk:toolkit:default-region");

        const run = compose(
            RestToGqlOrchestration,
            RestToGqlAppSync,
            RestToGqlAPI,
            RestToGqlFunctions,
            RestToGqlAuth,
            RestToGqlTable,
            RestToGqlES
        );

        run(this);
    }
}
