import os
import sys
from dotenv import load_dotenv
import inquirer
import time

# Change directory to same directory script is stored in (so that relative file paths work)
os.chdir(sys.path[0])

# Load environment variables
load_dotenv()

# Define Graph ID and Apollo Key
graph_ref = os.environ.get('APOLLO_GRAPH_REF')
apollo_key = os.environ.get('APOLLO_KEY')

# Define subgraphs
subgraphs = ['checkouts', 'customers', 'inventory', 'locations', 'orders', 'products', 'reviews']

# Define clients
clients = ['production', 'public-production']

# Function to build and run a managed gateway and subgraphs locally
def run_managed_locally():
  # Confirm the graph reference is the one that the user wants to start
  graph_ref_question = [
    inquirer.Confirm('confirm_graph_ref', message='Do you want to start gateway for ' + graph_ref + '?', default='True')
  ]
  publish_question =[
    inquirer.Confirm('publish', message='Do you want to publish the subgraph schemas?')
  ]

  if (inquirer.prompt(graph_ref_question)['confirm_graph_ref']):
    # Check whether subgraph schemas should be published
    publish_answer = inquirer.prompt(publish_question)

    # If subgraphs are being published, make sure there is at least a 5s delay between the publish calls (to prevent race conditions)
    if publish_answer['publish']:
      time_delay=5
    else:
      time_delay=0

    # Build the gateway and subgraphs
    os.system('docker build -t gateway ./local-gateway/')
    for subgraph in subgraphs:
      start_time=time.time()
      os.system('docker build -t ' + subgraph + '-subgraph ./subgraph/' + subgraph)
      # Delay the publish call if required
      current_time = time.time()
      while current_time - start_time < time_delay:
        current_time = time.time()
      # Publish the subgraph schema if required
      if publish_answer['publish']:
        publish_subgraph_schema(subgraph)

    # Run the gateway and subgraphs
    os.system('docker-compose -f managed-test.yml up -d')

# Function to build and run an umanaged gateway and subgraphs locally
def run_unmanaged_locally():
  # Build the gateway and subgraphs
  os.system('docker build -f ./local-gateway/Dockerfile.unmanaged -t gateway-unmanaged ./local-gateway/')
  for subgraph in subgraphs:
    os.system('docker build -t ' + subgraph + '-subgraph ./subgraph/' + subgraph)

  # Set the graph ref - fixed to dev variant for now
  os.system('docker-compose -f unmanaged-test.yml up -d')

# Function to build and run clients locally
def run_client_locally():
  # Choose which client to run
  client_question = [inquirer.List('client', message = 'Which client would you like to run?', choices = clients)]
  client = inquirer.prompt(client_question)["client"]

  os.system('docker build -t client ./client/' + client)
  # Join the container to the gtm-studio-demo network started by default when graph is started 
  gateway_url = 'http://gateway:3200'
  os.system('docker run --rm --network="gtm-studio-demo_default" --env GATEWAY_URL=' + gateway_url + ' client')

# Function to check subgraph schemas
def check_subgraph_schema(subgraph):
  # Publish the subgraph schema
  os.system('rover subgraph check ' + graph_ref + ' --schema=./subgraph/' + subgraph + '/schema.graphql --name=' + subgraph + ' --validation-period=4weeks')

# Function to publish subgraph schemas
def publish_subgraph_schema(subgraph):
  # Publish the subgraph schema
  os.system('rover subgraph publish ' + graph_ref + ' --schema=./subgraph/' + subgraph + '/schema.graphql --name=' + subgraph + ' --routing-url http://' + subgraph + ':3200')

if __name__ == '__main__':
  # Check what action script should take
  initial_question = [
    inquirer.List(
        'script_action',
        message='What would you like to do?',
        choices=['Run Unmanaged Supergraph Locally', 'Run Managed Supergraph Locally', 'Run Client', 'Check Subgraph Schema', 'Publish Subgraph Schema'],
    ),
  ]
  subgraph_question =[inquirer.List('subgraph', message = 'Which subgraph would you like to run this for?', choices = subgraphs)]

  script_action = inquirer.prompt(initial_question)['script_action']
  if script_action == 'Run Managed Supergraph Locally':
    run_managed_locally()
  elif script_action == 'Run Unmanaged Supergraph Locally':
    run_unmanaged_locally()
  elif script_action == 'Run Client':
    run_client_locally()
  elif script_action == 'Check Subgraph Schema':
    subgraph = inquirer.prompt(subgraph_question)['subgraph']
    check_subgraph_schema(subgraph)
  elif script_action == 'Publish Subgraph Schema':
    subgraph = inquirer.prompt(subgraph_question)['subgraph']
    publish_subgraph_schema(subgraph)