import { ethers } from "ethers";

export const deposit = async (syncWallet, ethAmountString) => {
  return await syncWallet.depositToSyncFromEthereum({
    depositTo: syncWallet.address(),
    token: "ETH",
    amount: ethers.utils.parseEther(ethAmountString),
  });
};

export const getTxFee = async (syncProvider, address, tokenLike, txType) => {
  return await syncProvider.getTransactionFee(txType || "Transfer", address, tokenLike);
};

// https://zksync.io/api/sdk/js/providers.html#submit-transaction
export const submitTx = async (syncProvider, from, to, token, amount, fee, pubKey, signature) => {
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
