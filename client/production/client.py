import random, os, copy, time, logging, string

from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)

def run_client():
    # Define default set of queries that all clients and client versions will call and the default number of times they will call that query
    queries = {
        "TopProducts": {
            "query": gql("query TopProducts { products { id, title, url, description, price { cost { amount, currencyCode } }, salesRankOverall, category }}"),
            "number_of_calls": 3
        },
        "Me": {
            "query": gql("query Me { me { id, email }}"),
            "number_of_calls": 2
        },
        "CustomerWithOrderHistory": {
            "query": gql("query CustomerWithOrderHistory { me { contactNumber, defaultShippingAddress { address1, address2, city, country, countryCode, id } email, id orderHistory { id, status, items { dealPrice { amount, currencyCode } product { category, description, id, price { cost { amount, currencyCode }  deal, dealSavings { amount, currencyCode } } reviews { rating } title, url } quantityOrdered, stockedFrom { warehouse { id  } } } shippingAddress { address1, address2, city, country, countryCode, id } } } }"),
            "number_of_calls": 1
        },
        "ProductsAndReviews": {
            "query": gql("query ProductsAndReviews { products { id, title, description, price { cost { amount, currencyCode } } reviews { id, rating content } reviewSummary { totalReviews, averageRating } } }"),
            "number_of_calls": 1
        },
        "MeWithDefaultShippingAddress": {
            "query": gql("query MeWithDefaultShippingAddress { me { id, email, contactNumber, defaultShippingAddress { id, address1, address2, city, country, countryCode } } }"),
            "number_of_calls": 1
        },
        "CustomerActiveCart": {
            "query": gql("query CustomerActiveCart { me { activeCart { status, order { items { product { title, reviews { rating } } quantityOrdered } } subtotal { amount, currencyCode } taxes { amount, currencyCode } shipping { amount, currencyCode } total { amount, currencyCode } } } }"),
            "number_of_calls": 2
        },
        "CustomerWithOrderHistory": {
            "query": gql("query CustomerWithOrderHistory { me { contactNumber, defaultShippingAddress { address1, address2, city, country, countryCode, id } email, id orderHistory { id, status, items { dealPrice { amount, currencyCode } product { category, description, id, price { cost { amount, currencyCode }  deal, dealSavings { amount, currencyCode } } reviews { rating } title, url } quantityOrdered, stockedFrom { warehouse { id  } } } shippingAddress { address1, address2, city, country, countryCode, id } } } }"),
            "number_of_calls": 1
        },
        "TopProductsDeprecated": {
            "query": gql("query TopProducts($first: Int) { topProducts(first: $first) { id, title, url, price { cost { amount, currencyCode } } } }"),
            "number_of_calls": 0
        },
        "TopProductsDeprecatedError": {
            "query": gql("query TopProducts($first: Int) { topProducts(first: $first) { id, title, url, details, price { cost { amount, currencyCode } } } }"),
            "number_of_calls": 0
        },
    }

    # Define the clients and client versions - add the default queries object for each and set the ratio of calls per version
    clients = {
        "iOS": {
            "1.0": {
                "queries": copy.deepcopy(queries),
                "number_of_calls": 1
            },
            "1.0.1": {
                "queries": copy.deepcopy(queries),
                "number_of_calls": 1
            },
            "1.1": {
                "queries": copy.deepcopy(queries),
                "number_of_calls": 2
            },
            "1.2": {
                "queries": copy.deepcopy(queries),
                "number_of_calls": 1
            },
        },
        "web": {
            "1.0": {
                "queries": copy.deepcopy(queries),
                "number_of_calls": 1
            },
            "1.1": {
                "queries": copy.deepcopy(queries),
                "number_of_calls": 2
            },
            "1.2": {
                "queries": copy.deepcopy(queries),
                "number_of_calls": 4
            },
        },
        "Android": {
            "1.0": {
                "queries": copy.deepcopy(queries),
                "number_of_calls": 2
            },
            "1.1": {
                "queries": copy.deepcopy(queries),
                "number_of_calls": 1
            },
            "1.2": {
                "queries": copy.deepcopy(queries),
                "number_of_calls": 1
            },
        },
    }

    # Override some query call defaults (so each client version has a unique mix of query calls)
    clients["iOS"]["1.0"]["queries"]["TopProductsDeprecatedError"]["number_of_calls"] = 3
    clients["iOS"]["1.0"]["queries"]["TopProducts"]["number_of_calls"] = 0
    clients["iOS"]["1.0.1"]["queries"]["TopProductsDeprecated"]["number_of_calls"] = 3
    clients["iOS"]["1.0.1"]["queries"]["TopProducts"]["number_of_calls"] = 0
    clients["Android"]["1.0"]["queries"]["TopProductsDeprecated"]["number_of_calls"] = 3
    clients["Android"]["1.0"]["queries"]["TopProducts"]["number_of_calls"] = 0

    host = os.environ.get("GATEWAY_URL")
    api_key = os.environ.get("API_KEY")

    total_queries_executed = 0
    start_time = time.perf_counter()

    # Repeat whole script between 1 and 4 times
    for k in range(random.randint(1,4)):
        # Loop over all clients and their versions
        for client_name in clients:
            for version_name in clients[client_name]:
                # Find the number of times this version's calls should be repeated
                number_of_version_calls = clients[client_name][version_name]["number_of_calls"]
                
                for i in range(number_of_version_calls):
                    # Find the queries this version should execute
                    version_queries = clients[client_name][version_name]["queries"]
                    
                    for query_name in version_queries:
                        gql_query = version_queries[query_name]["query"]
                        number_of_calls = version_queries[query_name]["number_of_calls"]
                        for j in range(number_of_calls):
                            # Generate a fake trace-id
                            source = string.ascii_lowercase + string.digits
                            trace_id = ''.join((random.choice(source) for i in range(32)))

                            # Select your transport with a defined url endpoint
                            transport = RequestsHTTPTransport(
                                url=host, 
                                headers={
                                    'apollographql-client-name': client_name,
                                    'apollographql-client-version': version_name,
                                    'x-api-key': api_key,
                                    'trace-id': trace_id,
                                }, verify=True, retries=3,
                            )

                            # Create a GraphQL client using the defined transport
                            client = Client(transport=transport, fetch_schema_from_transport=False)
                            
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