import * as cdk from "@aws-cdk/cdk";
import * as stepfunctions from "@aws-cdk/aws-stepfunctions";
import * as stepfunctionsTasks from "@aws-cdk/aws-stepfunctions-tasks";

import IRestToGqlStack from "../interfaces/IRestToGqlStack";

const RestToGqlOrchestration = (stack: IRestToGqlStack) => {
    const scope = (stack as unknown) as cdk.Construct;

    const fns = stack.Functions;
    const esSetup = new stepfunctions.Task(scope, "Create ES Index", {
        task: new stepfunctionsTasks.InvokeFunction(fns["es-setup"])
    });

    const seedDDB = new stepfunctions.Task(scope, "Seed Company Table", {
        task: new stepfunctionsTasks.InvokeFunction(fns["seed-ddb"])
    });

    const cognitoAdd = new stepfunctions.Task(scope, "Add cognito user to pool", {
        task: new stepfunctionsTasks.InvokeFunction(fns["add-cognito-user"])
    });

    const definition = esSetup.next(seedDDB).next(cognitoAdd);

    const state = new stepfunctions.StateMachine(scope, "StateMachine", {
        definition,
        timeoutSec: 300
    });

    new cdk.CfnOutput(scope, "state_machine_id", {
        value: state.stateMachineArn
    });

    stack.Orchestration = state;

    return stack;
};

export default RestToGqlOrchestration;
