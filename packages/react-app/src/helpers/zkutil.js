import { ethers } from "ethers";

export const deposit = async (syncWallet, ethAmountString) => {
  const depositTo = syncWallet.address();
  console.log("deposit", depositTo, ethAmountString);
  return await syncWallet.depositToSyncFromEthereum({
    depositTo,
    token: "ETH",
    amount: ethers.utils.parseEther(ethAmountString),
  });
};

export const getTxFee = async (syncProvider, address, tokenLike, txType) => {
  return await syncProvider.getTransactionFee(txType || "Transfer", address, tokenLike);
};

export const getBalances = async syncWallet => {
  const state = await syncWallet.getAccountState();
  return state.committed.balances;
};

// https://zksync.io/api/sdk/js/providers.html#submit-transaction
export const submitTx = async (syncProvider, from, to, token, amount, fee, pubKey, signature) => {
  console.log("submit", syncProvider, from, to, token, amount, fee, pubKey, signature);
  const signedTransferTx = {
    accountId: 13, // id of the sender account in the zkSync
    type: "Transfer",
    from,
    to,
    token, // id of the ETH token
    amount,
    fee,
    nonce: 0,
    signature: {
      pubKey,
      signature,
    },
  };

  const ethSignature = "0xdddaaa...1c"; // Ethereum ECDSA signature of the readableTxInfo

  return await syncProvider.submitTx(signedTransferTx, ethSignature);
};
