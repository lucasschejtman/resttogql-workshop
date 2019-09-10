import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

import IRestToGqlStack from "../interfaces/IRestToGqlStack";
import { RemovalPolicy } from "@aws-cdk/core";

const DDB_TABLE_PK = process.env.DDB_TABLE_PK || "";
const DDB_TABLE_NAME = process.env.DDB_TABLE_NAME || "";

const RestToGqlTable = (stack: IRestToGqlStack) => {
    const scope = (stack as unknown) as cdk.Construct;
    stack.Table = new dynamodb.Table(scope, DDB_TABLE_NAME, {
        tableName: DDB_TABLE_NAME,
        stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
        removalPolicy: RemovalPolicy.DESTROY,
        partitionKey: { name: DDB_TABLE_PK, type: dynamodb.AttributeType.NUMBER }
    });

    return stack;
};

export default RestToGqlTable;
