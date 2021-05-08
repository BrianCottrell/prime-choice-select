export const ABI = [
  {
    constant: false,
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint104",
        name: "_amount",
        type: "uint104",
      },
      {
        internalType: "address",
        name: "_franklinAddr",
        type: "address",
      },
    ],
    name: "depositERC20",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_franklinAddr",
        type: "address",
      },
    ],
    name: "depositETH",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
];
