import random, os, copy, time, logging

from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)

def run_client():
    # Define default set of queries that all clients and client versions will call and the default number of times they will call that query
    queries = {
        "AllProducts": {
            "query": gql("query AllProducts { products { id, title, url, description }}"),
            "number_of_calls": 3
        },
        "ProductsAndReviews": {
            "query": gql("query ProductsAndReviews { products { id, title, description, price { cost { amount, currencyCode } } reviewSummary { totalReviews, averageRating } } }"),
            "number_of_calls": 1
        },
    }

    # Define the clients and client versions - add the default queries object for each and set the ratio of calls per version
    clients = {
        "Public_User_1": {
            "1.0": {
                "queries": copy.deepcopy(queries),
                "number_of_calls": 2
            },
        },
        "Public_User_2": {
            "1.0": {
                "queries": copy.deepcopy(queries),
                "number_of_calls": 1
            },
        },
    }

    host = os.environ.get("GATEWAY_URL", "https://cse-studio-demo-api-gateway-50iez2ia.ue.gateway.dev/ecomm-fed1/public")

    total_queries_executed = 0
    start_time = time.perf_counter()

    # Repeat whole script between 1 and 4 times
    for k in range(random.randint(1,4)):
        # Loop over all clients and their versions
        for client_name in clients:
            for version_name in clients[client_name]:
                # Select your transport with a defined url endpoint
                transport = RequestsHTTPTransport(
                    url=host, 
                    headers={
                        'apollographql-client-name': client_name,
                        'apollographql-client-version': version_name,
                        # 'Authorization': id_token
                    }, verify=True, retries=3,
                )

                # Create a GraphQL client using the defined transport
                client = Client(transport=transport, fetch_schema_from_transport=False)

                # Find the number of times this version's calls should be repeated
                number_of_version_calls = clients[client_name][version_name]["number_of_calls"]
                
                for i in range(number_of_version_calls):
                    # Find the queries this version should execute
                    version_queries = clients[client_name][version_name]["queries"]
                    
                    for query_name in version_queries:
                        gql_query = version_queries[query_name]["query"]
                        number_of_calls = version_queries[query_name]["number_of_calls"]
                        for j in range(number_of_calls):
                            # Execute the query on the transport
                            try:
                                result = client.execute(gql_query)
                                logging.info('Successful ' + query_name + ' call as ' + client_name + ' v' + version_name)
                            except:
                                logging.error('Error calling ' + query_name + ' as ' + client_name + ' v' + version_name)
                            total_queries_executed += 1

    end_time = time.perf_counter()
    print(f"Exectued {total_queries_executed} queries in {end_time - start_time:0.2f} seconds")

if __name__=="__main__":
    run_client()