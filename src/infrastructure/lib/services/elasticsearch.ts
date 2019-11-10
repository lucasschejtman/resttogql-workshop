import * as cdk from '@aws-cdk/core';
import * as elasticsearch from '@aws-cdk/aws-elasticsearch';

import IRestToGqlStack from '../interfaces/IRestToGqlStack';

const ES_DOMAIN_NAME = process.env.ES_DOMAIN_NAME || '';

const RestToGqlES = (stack: IRestToGqlStack) => {
    const scope = (stack as unknown) as cdk.Construct;
    // CDK/ElasticSearch has no abrastraction yet so I need to create my own logical id
    // cannot use ES_DOMAIN_NAME
    stack.ESDomain = new elasticsearch.CfnDomain(scope, 'RestToGqlESDomain', {
        domainName: ES_DOMAIN_NAME,
        elasticsearchVersion: '5.5',
        elasticsearchClusterConfig: {
            instanceCount: 1,
            instanceType: 't2.small.elasticsearch'
        },
        ebsOptions: {
            ebsEnabled: true,
            volumeSize: 10
        },
        accessPolicies: {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: {
                        AWS: [stack.Account]
                    },
                    Action: ['es:*'],
                    Resource: `arn:aws:es:${stack.Region}:${stack.Account}:domain/${ES_DOMAIN_NAME}/*`
                }
            ]
        }
    });

    return stack;
};

export default RestToGqlES;
