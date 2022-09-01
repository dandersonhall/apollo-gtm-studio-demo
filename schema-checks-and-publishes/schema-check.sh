#!/bin/bash
npx -p @apollo/rover rover subgraph check $APOLLO_GRAPH_REF --schema ./build-error-schema.graphql --name products
sleep 1m
npx -p @apollo/rover rover subgraph check $APOLLO_GRAPH_REF --schema ./operations-error-schema.graphql --name products
sleep 1m
npx -p @apollo/rover rover subgraph check $APOLLO_GRAPH_REF --schema ./good-schema.graphql --name products

npx -p @apollo/rover rover subgraph publish $APOLLO_GRAPH_REF --schema ./build-error-schema.graphql --name products
sleep 1m
npx -p @apollo/rover rover subgraph publish $APOLLO_GRAPH_REF --schema ./operations-error-schema.graphql --name products
sleep 30s
npx -p @apollo/rover rover subgraph publish $APOLLO_GRAPH_REF --schema ./actual-schema.graphql --name products