# This is Kramp Assignment 
This is an assignment for Kramp. The goal is to have a coverage for kramp's webshop mainflow.
Here is one main flow scenario. The decision why only one was used is that any scenarios which is inside the mainflow. So any step is the part of user journey and it is stops them to place an order. So from that prospective it is better to have one e2e scenario with happy path and component/unit tests for specific services to cover corelations. If this e2e happy path scenario is working that means product still capable to generate the value.
# The design
Here is one test with a fixture which retrun authorized page after and a teardown fixtures with the file scope which should cleanup the busket from any orders to not affect other runs. 
For clean up is using API client which fetch a quote via graphQL and after test delete that quote. The clinet get authorization.
The test is following simple flow for the user it apply search (possible point to grow), select an item, put it into cart and later place an order and validate the state inside.
## Other scenarios worth to be considered
There are other user flows which could be covered such as seraching for dealer or signing up as a customer. For this scope is better to have other user flow. 
# Run and use
To run tests you have several options such as native, IDE and CI runs. 
## Requirements
before running code you need to install
[Node js 22+](https://nodejs.org/en/download)

```bash
npm ci
```
## PreRequisites
To ran native you need to install all [requirements](##Requirements) on your computer. 
You also need to set up some enviromental variables or define yout `.env` file. Mandatory variables are described in `.env.example`
```bash
BASE_URL=''
PLATFORM_LOGIN=''
PLATFORM_PASSWORD=''
USER_LOGIN=''
USER_PASSWORD=''
```

## How to run in cli
To run tests run comand in root of repo
```bash
npx palywright test
```
You also can specify the running options such as specific reporter 
```bash
npx playwright test --reporter=list
```
More about running [options](https://playwright.dev/docs/test-cli)
### Reporting
After run you are able to see the report from most recent run. It will searching the standard reporting folders in root of repository
```bash
npx playwright show-report
```
More about [reporting](https://playwright.dev/docs/test-reporters)

## CI workflow run
Ci has it's own pipeline to run it. It will automatically run after new push
Other option to run it using workflows. You can run it from [here](https://github.com/Yutsis1/Funda_assignment/actions/workflows/playwright.yml)

## IDE run 
It depends which IDE you are using. For VS Code you need to install t[his plugin](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) 