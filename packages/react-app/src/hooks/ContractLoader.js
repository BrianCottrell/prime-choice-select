/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Contract } from "@ethersproject/contracts";
import { useState, useEffect } from "react";

/*
  ~ What it does? ~

  Loads your local contracts and gives options to read values from contracts 
                                              or write transactions into them

  ~ How can I use? ~

  const readContracts = useContractLoader(localProvider) // or
  const writeContracts = useContractLoader(userProvider)

  ~ Features ~

  - localProvider enables reading values from contracts
  - userProvider enables writing transactions into contracts
  - Example of keeping track of "purpose" variable by loading contracts into readContracts 
    and using ContractReader.js hook:
    const purpose = useContractReader(readContracts,"PaymentContract", "purpose")
  - Example of using setPurpose function from our contract and writing transactions by Transactor.js helper:
    tx( writeContracts.PaymentContract.setPurpose(newPurpose) )
*/

export const loadContract = (contractName, signer, contractAddress) => {
  const abi = require(`../contracts/${contractName}.abi.js`);
  const newContract = new Contract(contractAddress || require(`../contracts/${contractName}.address.js`), abi, signer);
  try {
    newContract.bytecode = require(`../contracts/${contractName}.bytecode.js`);
    newContract.abi = abi;
  } catch (e) {
    console.log(e);
  }
  return newContract;
};

export default function useContractLoader(providerOrSigner, contractAddress) {
  const [contracts, setContracts] = useState();
  useEffect(() => {
    async function loadContracts() {
      if (typeof providerOrSigner !== "undefined") {
        try {
          // we need to check to see if this providerOrSigner has a signer or not
          let signer;
          let accounts;
          if (providerOrSigner && typeof providerOrSigner.listAccounts === "function") {
            accounts = await providerOrSigner.listAccounts();
          }

          if (accounts && accounts.length > 0) {
            signer = providerOrSigner.getSigner();
          } else {
            signer = providerOrSigner;
          }

          const contractList = require("../contracts/contracts.js");

          const newContracts = contractList.reduce((accumulator, contractName) => {
            accumulator[contractName] = loadContract(contractName, signer, contractAddress);
            return accumulator;
          }, {});
          setContracts(newContracts);
        } catch (e) {
          console.log("ERROR LOADING CONTRACTS!!", e);
        }
      }
    }
    loadContracts();
  }, [providerOrSigner]);
  return contracts;
}
