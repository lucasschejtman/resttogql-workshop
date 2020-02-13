import { execSync } from 'child_process';
import path = require('path');
import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
//import { AssetPackaging } from "@aws-cdk/assets";
import { Duration } from '@aws-cdk/core';

type FnProps = Partial<lambda.FunctionProps> & {
    // I'll remove this once there's a better integration with SAM
    hasDeps?: boolean;
};

const FN_PATH = 'server';

const installDeps = (dir: string) => execSync('npm install', { cwd: dir });

export const Function = (scope: cdk.Construct) => (id: string, props: FnProps) => {
    const dir = path.join('..', FN_PATH, id);

    if (props.hasDeps) installDeps(dir);

    const fn = new lambda.Function(scope, id, {
        role: props.role,
        timeout: Duration.seconds(180),
        environment: props.environment || {},
        functionName: props.functionName || id,
        handler: props.handler || 'index.handler',
        runtime: props.runtime || lambda.Runtime.NODEJS_10_X,
        code: props.code || new lambda.AssetCode(dir)
    });

    return fn;
};
