import { ethers } from "ethers";

export const deposit = (syncWallet, ethAmountString) => {
  return syncWallet.depositToSyncFromEthereum({
    depositTo: syncWallet.address(),
    token: "ETH",
    amount: ethers.utils.parseEther(ethAmountString),
  });
};
