<p align='center'>
    <img src='./img/logo.png' width=400/>
</p>

## Primechoice Select

A blockchain application that helps automatically select the best blockchain to facilitate a given transaction based on the requirements of the payment.

<!--  http://localhost:3000/send?payment=0xc837BAf7132aA09de899b9eD5152E3671C62951-->

### Sponsors

- Chainlink: Performs price comparison against Layer1 currencies
- Tellor: Performs price comparison against Layer1 currencies
- Skale: Enables private networks for deploying invoices and collecting payments.
- Torus: Can use metamask (and/or Torus based authentication via email) to authenticate to Layer 1 contracts, and layer 2 ZkSync API service.
- Starkware (Cairo) - Program that validates the best token selection based on speed and fee criteria.
- ZkSync - Fetches supported tokens, performs quote estimates for different currencies supported by the vendor, performs the transaction against Layer2 network using the protocol of choice.

<!--
https://github.com/austintgriffith/scaffold-eth#%EF%B8%8F-quick-start
-->

### Running the project

Run the following services/commands in different terminal windows starting from the root directory of this project:

1. Install dependencies when running for the first time:
   `yarn`

2. Start local chain:
   `yarn chain`

3. Deploy smart contract
   `yarn deploy`

4. Start client website:
   `yarn start`

If successful Primechoice Select should now be ready and available on `localhost:3000`

### Selecting network

- Update `defaultNetwork` in hardhat.config.js in hardhat package>
- Update `TARGET_NETWORK_NAME` in constants.js in react package.

### User flow (Two party: Merchant and payer)

1. Merchant wants to collect a payment with optimal fees
2. Login with Torus or Metamask to register a new payment.
3. Create as one time or subscription Payment (choose subscription), ask for example tokens.
4. Generate a url - url can be shared with the buyer or on your website.
5. Every payment gets it's own unique url and can only be claimed once.
6. Enter payment address.
7. Show token options and previewing contract.
8. Submit payment / discuss recurring payments and low per-transaction cost. Stripe for example takes a flat fee of every transaction which can already exceed that of a single layer 2 withdrawl if subscription payments batched strategically.
9. Stackware/Cairo verification of optimal contract (show input and request parameters, their definitions, and proof of best output).

### Screenshots

<p>Home</p>
<img src="./img/home.png" width=600/>
<p>Payment Contract</p>
<img src="./img/contract.png" width=600/>
<p>Payer screen</p>
<img src="./img/payer.png" width=600/>
<p>Cairo: Deploying optimal proof via Cairo</p>
<img src="./img/cairo.png" width=600/>
<p>Torus: Log in with Torus</p>
<img src="./img/torus.png" width=600/>
<p>SKALE: Deploying to a private network</p>
<img src="./img/skale.png" width=600/>
<p>SKALE: Selecting Skale network for Primechoice Select</p>
<img src="./img/skale_deploy.png" width=600/>
