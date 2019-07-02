/*
 * Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 */

///////////////////////////////////////////////////////////////
//
// Configuration
//
///////////////////////////////////////////////////////////////
var AWS = require("aws-sdk");
var path = require("path");
var endpoint = new AWS.Endpoint(process.env.ES_ENDPOINT);
var creds = new AWS.EnvironmentCredentials("AWS");
var region = process.env.REGION || "ap-southeast-1";

var esDomain = {
    region: region,
    endpoint: process.env.ES_ENDPOINT,
    index: "stocks",
    doctype: "stock_event"
};

/////////////////////////////////////////////////
//
// main()
//
/////////////////////////////////////////////////

exports.handler = function(event, context) {
    console.log(JSON.stringify(event, null, "  "));

    event.Records.forEach(function(record) {
        if (record.dynamodb.NewImage) {
            console.log("Processing: " + JSON.stringify(record.dynamodb));
            postToES(record.dynamodb.NewImage, context);
        } else {
            console.log("Skipping: " + JSON.stringify(record.dynamodb));
        }
    });
};

/*
 * Post the given document to Elasticsearch
 */
function postToES(record, context) {
    var req = new AWS.HttpRequest(endpoint);

    req.method = "POST";
    req.path = path.join("/", esDomain.index, esDomain.doctype);
    req.region = esDomain.region;
    req.headers["presigned-expires"] = false;
    req.headers["Host"] = endpoint.host;
    req.body = JSON.stringify({
        timestamp: new Date().getTime(),
        companyId: record.company_id.N,
        stockValue: record.stock_value.N,
        delta: record.delta.N
    });

    var signer = new AWS.Signers.V4(req, "es"); // es: service code
    signer.addAuthorization(creds, new Date());

    var send = new AWS.NodeHttpClient();
    send.handleRequest(
        req,
        null,
        function(httpResp) {
            var respBody = "";
            httpResp.on("data", function(chunk) {
                respBody += chunk;
            });
            httpResp.on("end", function(chunk) {
                console.log("Response: " + respBody);
                context.succeed("Lambda added document " + req.body);
            });
        },
        function(err) {
            console.log("Error: " + err);
            context.fail("Lambda failed with error " + err);
        }
    );
}
