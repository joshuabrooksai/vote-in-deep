// EncryptedVoting contract configuration
// Update CONTRACT_ADDRESS after deploying to Sepolia
export const CONTRACT_ADDRESS = '0xE1986fD7E434BbDD18D38d39F67B1f464fEECa08';

export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "AlreadyVoted",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "DuplicateAccess",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "EmptyOption",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EmptyTitle",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pollId",
        "type": "uint256"
      }
    ],
    "name": "InvalidPoll",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "length",
        "type": "uint256"
      }
    ],
    "name": "OptionsOutOfRange",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "caller",
        "type": "address"
      }
    ],
    "name": "Unauthorized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ZeroAddress",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "pollId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "KeyAccessGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "pollId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "PollCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "pollId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      }
    ],
    "name": "VoteSubmitted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "encryptedTitle",
        "type": "bytes"
      },
      {
        "internalType": "bytes[]",
        "name": "encryptedOptions",
        "type": "bytes[]"
      },
      {
        "internalType": "externalEaddress",
        "name": "encryptedKey",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "keyProof",
        "type": "bytes"
      }
    ],
    "name": "createPoll",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "pollId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pollId",
        "type": "uint256"
      }
    ],
    "name": "getEncryptedPollData",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "encryptedTitle",
        "type": "bytes"
      },
      {
        "internalType": "bytes[]",
        "name": "encryptedOptions",
        "type": "bytes[]"
      },
      {
        "internalType": "eaddress",
        "name": "encryptedKey",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pollId",
        "type": "uint256"
      }
    ],
    "name": "getEncryptedVoteCounts",
    "outputs": [
      {
        "internalType": "euint32[]",
        "name": "counts",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pollId",
        "type": "uint256"
      }
    ],
    "name": "getPollMetadata",
    "outputs": [
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "optionCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pollId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantKeyAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pollId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasKeyAccess",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pollId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pollCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pollId",
        "type": "uint256"
      },
      {
        "internalType": "externalEuint32",
        "name": "encryptedChoice",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "choiceProof",
        "type": "bytes"
      }
    ],
    "name": "submitVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
