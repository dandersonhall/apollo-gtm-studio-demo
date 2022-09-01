# GTM Studio Demo

## Quip Doc
Details on how to use the demo environment can be found [here](https://apollographql.quip.com/E7imA9yoSLdq/CSE-Studio-Demo-Environment)

## Run Locally
### Prerequisites
1. Check out this repository
2. [Install Docker for Mac](https://docs.docker.com/desktop/install/mac-install/) - make sure to select the right chip when you install
3. [Install Homebrew & Python 3](https://docs.python-guide.org/starting/install3/osx/)
4. [Install NVM for Mac](https://tecadmin.net/install-nvm-macos-with-homebrew/)
5. Install NodeJS v16.13.1 using NVM 
```
nvm install v16.13.1
```
6. Use NodeJS v16.13.1
```
nvm use v16.13.1
```
If you want to run a managed gateway then also:
1. [Install the Rover CLI](https://www.apollographql.com/docs/rover/)
2. Log into Studio and create a Deployed Graph, get an API Key and note your Graph ID and Variant ID

### Prepare Local Machine to Run Python Script
The `run-local.py` script will create the local gateway (defined in local-gateway directory) and subgraph containers. The gateway can be run in managed and unmanaged mode.
To run the script:
- Install the `requirements.txt` file:  
```
pip3 install -r requirements.txt
```
- Run the script:  
```
python3 run-local.py
```

### Run Unmanaged Gateway and Subgraphs
- After running the `run-local.py` script, select 'Run Unmanaged Supergraph Locally'. This will build the containers and start them up.
- The gateway sandbox can be accessed at http://localhost:4000
- To stop the containers run 
```
docker-compose -f unmanaged-test.yml down
```

### Run Managed Gateway and Subgraphs
- Create a `.env` file in the repo's home directory. Add the following lines (make sure to substitute your Graph Reference and Key)  
```
APOLLO_KEY=CHANGE_ME
APOLLO_GRAPH_REF=GRAPH_ID@VARIANT
```
- After running the `run-local.py` script, select 'Run Managed Supergraph Locally'
- The script will ask for confirmation of the Graph Reference you are starting the gateway on
- The script will ask whether you want the subgraph schemas to be published. If you have a new graph variant this is the easiest way to get all subgraphs added to the supergraph.
- Next, the script will buildand run the gateway and subgraphs. It will also publish the subgraph schemas if selected
- The gateway sandbox can be accessed at http://localhost:4000
- To stop the containers run
```
docker-compose -f managed-test.yml down
```

### Run Client Jobs Locally
- Make sure that either the managed or unmanged graph is running locally
- Run the `run-local.py` script and select 'Run Client'
- Choose which client you want to execute
- Container will log output to the terminal and will be deleted upon completion

### Check Subgraph Schemas
- Run the `run-local.py` script and select 'Check Subgraph Schema'
- Select the subgraph you want to check
- This will check the subgraph schema against the graph and variant specified in the `.env` file

### Publish Subgraph Schemas
- Run the `run-local.py` script and select 'Publish Subgraph Schema'
- Select the subgraph you want to publish
- This will publish the subgraph schema to the graph and variant specified in the `.env` file