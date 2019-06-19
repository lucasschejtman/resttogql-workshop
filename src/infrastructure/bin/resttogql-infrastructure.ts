#!/usr/bin/env node
import cdk = require("@aws-cdk/cdk");
import { RestToGqlInfrastructureStack } from "../lib/resttogql-infrastructure-stack";

const app = new cdk.App();
new RestToGqlInfrastructureStack(app, "RestToGqlInfrastructureStack");
app.run();
