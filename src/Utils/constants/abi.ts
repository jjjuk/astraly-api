import { Abi } from 'starknet'

export const ACCOUNT_ABI: Abi = [
  {
    inputs: [
      {
        name: 'hash',
        type: 'felt',
      },
      {
        name: 'sig_len',
        type: 'felt',
      },
      {
        name: 'sig',
        type: 'felt*',
      },
    ],
    name: 'is_valid_signature',
    outputs: [
      {
        name: 'is_valid',
        type: 'felt',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
