+++
title = "Changing Queries"
chapter = false
weight = 2
+++

## Our Goal
The goal of this section is to change how the initial page loads.   Currenly it is using the following RESTful endpoint.  We want to change this to use oue new GraphQL schema that we looked at in the last section.

The good news is we can add this query is such a way to be able to query the existing REST endpoint - we do this by using an HTTP Resolver.

This method sometimes called the service facade pattern allows us with minimal code changes to facade the existing API with our new one, so reducing the introduction of bugs.
Typically this pattern is used when the service being facaded is legacy code that no-one is maintaining.




{{% notice info %}}
For more information on resolvers see [https://TODO](https://TODO)
{{% /notice %}}

#### Testing our Query
We can test our query by using the Query browser thats build into AWS AppSync.  Simply navigate to Query Browser and try the following..


