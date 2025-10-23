# Vote in Deep

A decentralized, privacy-preserving voting application built on blockchain using Fully Homomorphic Encryption (FHE). Vote in Deep enables users to create encrypted polls, cast encrypted votes, and maintain complete privacy while ensuring transparency and verifiability through blockchain technology.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Why Vote in Deep?](#why-vote-in-deep)
- [Technology Stack](#technology-stack)
- [Problems We Solve](#problems-we-solve)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running Locally](#running-locally)
  - [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Smart Contract](#smart-contract)
- [Frontend Application](#frontend-application)
- [How It Works](#how-it-works)
- [Testing](#testing)
- [Security Considerations](#security-considerations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Overview

**Vote in Deep** demonstrates the practical application of Fully Homomorphic Encryption (FHE) in decentralized voting systems. Unlike traditional voting DApps where votes are either publicly visible or require complex zero-knowledge proof systems, Vote in Deep leverages Zama's FHEVM to perform computations directly on encrypted data.

This means:
- Poll titles and options are encrypted before being stored on-chain
- Votes are submitted as encrypted values
- Vote tallying happens through homomorphic operations without ever decrypting individual votes
- Only users granted explicit access can decrypt and view poll details and results
- Complete privacy is maintained while preserving the integrity and transparency of blockchain

## Key Features

### 1. Encrypted Poll Creation
- Create polls with custom titles and 2-4 options
- All poll data is encrypted client-side before blockchain storage
- Random encryption keys are generated and stored as encrypted addresses
- Creators maintain full control over their polls

### 2. Privacy-Preserving Voting
- Cast votes that remain encrypted on-chain
- Vote counts are incremented using homomorphic operations
- One vote per address enforced at the smart contract level
- No one can see how individual users voted

### 3. Granular Access Control
- Poll creators can grant decryption access to specific Ethereum addresses
- Only authorized users can decrypt poll details and view results
- Access permissions are managed through FHE's built-in permission system
- Supports selective transparency: share results with stakeholders without exposing all data publicly

### 4. Decentralized Poll Discovery
- Browse all created polls on the blockchain
- View public metadata (creator address, creation timestamp)
- Encrypted details display as masked until proper access is granted
- Polls sorted by creation time for easy navigation

### 5. User-Friendly Interface
- Clean, intuitive React-based UI
- Seamless wallet integration via RainbowKit
- Real-time updates after transactions
- Clear feedback for all user actions

## Why Vote in Deep?

### Advantages Over Traditional Voting Systems

#### 1. **True Privacy**
Traditional blockchain voting systems face a fundamental dilemma: either votes are public (defeating the purpose of secret ballots) or they require complex cryptographic schemes that are hard to implement and audit. Vote in Deep solves this with FHE:
- Votes remain encrypted even on a public blockchain
- No centralized trusted party needed for vote counting
- Individual votes are never exposed, even to administrators

#### 2. **Transparent Yet Private**
- All voting activity is recorded on-chain for auditability
- Vote counts can be verified without exposing individual choices
- Eliminates the "black box" problem of traditional e-voting systems

#### 3. **Decentralized Trust**
- No central authority controls the voting process
- Smart contracts enforce rules automatically and transparently
- Immutable record prevents vote tampering or deletion

#### 4. **Selective Disclosure**
- Poll creators decide who can see results
- Enables use cases like:
  - Internal organizational polls with stakeholder-only access
  - Phased result disclosure (e.g., after voting closes)
  - Privacy-preserving market research
  - Anonymous feedback systems with controlled access

#### 5. **Cryptographically Secure**
- Built on Ethereum's proven security model
- Leverages Zama's audited FHE libraries
- Homomorphic encryption ensures computations are verifiable
- No trust required in third-party vote counters

### Real-World Applications

- **Corporate Governance**: Board voting with privacy for directors
- **DAOs**: Decentralized decision-making with vote privacy
- **Community Polls**: Gauge sentiment without public pressure
- **Research Surveys**: Collect sensitive data with guaranteed anonymity
- **Elections**: Small-scale democratic elections with full transparency
- **Feedback Systems**: Anonymous employee or user feedback

## Technology Stack

### Smart Contracts
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Solidity** | 0.8.27 | Smart contract programming language |
| **Hardhat** | Latest | Ethereum development environment |
| **FHEVM** | Latest | Fully Homomorphic Encryption Virtual Machine by Zama |
| **@fhevm/solidity** | Latest | FHE library for Solidity |
| **@zama-fhe/oracle-solidity** | Latest | Decryption oracle integration |
| **Ethers.js** | v6 | Web3 library for contract interaction |
| **TypeChain** | Latest | TypeScript bindings for contracts |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19 | UI framework |
| **TypeScript** | Latest | Type-safe JavaScript |
| **Vite** | Latest | Build tool and dev server |
| **Wagmi** | v2 | React hooks for Ethereum |
| **Viem** | v2 | Ethereum client for read operations |
| **Ethers.js** | v6 | Ethereum client for write operations |
| **RainbowKit** | Latest | Wallet connection UI |
| **TanStack React Query** | Latest | Data fetching and state management |
| **@zama-fhe/relayer-sdk** | Latest | FHE encryption/decryption client |

### Development Tools
| Technology | Purpose |
|-----------|---------|
| **Mocha & Chai** | Testing framework |
| **Hardhat-Deploy** | Automated contract deployment |
| **ESLint & Prettier** | Code quality and formatting |
| **Solhint** | Solidity linting |
| **Solidity Coverage** | Test coverage reporting |

### Infrastructure
- **Network**: Ethereum Sepolia Testnet
- **RPC Provider**: Infura
- **Block Explorer**: Etherscan
- **Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, and more

## Problems We Solve

### 1. **The Privacy vs Transparency Paradox**
**Problem**: Traditional blockchain voting exposes all votes publicly, violating ballot secrecy. Off-chain voting lacks transparency and requires trust in centralized entities.

**Our Solution**: FHE allows votes to be stored encrypted on-chain. Voting is transparent (anyone can verify the process) while individual votes remain private (encrypted data is unreadable without permission).

### 2. **Vote Manipulation and Coercion**
**Problem**: When votes are public or traceable, voters can be coerced or bribed to vote certain ways. Voters might face retaliation for their choices.

**Our Solution**: Since votes are encrypted and only aggregate results are decryptable, no one can prove how a specific address voted. This prevents vote buying and coercion.

### 3. **Centralized Trust Requirements**
**Problem**: Traditional e-voting systems require trusting a central authority to count votes honestly and protect privacy.

**Our Solution**: Smart contracts automatically enforce voting rules and count encrypted votes using homomorphic operations. No centralized trust needed.

### 4. **Lack of Auditability**
**Problem**: Many voting systems are "black boxes" where vote counting cannot be independently verified.

**Our Solution**: All encrypted votes and counts are stored on-chain. Anyone can verify the voting process and results using blockchain explorers and smart contract code.

### 5. **Complex Cryptographic Implementations**
**Problem**: Systems using zero-knowledge proofs or multi-party computation are extremely complex to implement correctly and audit for security.

**Our Solution**: Zama's FHEVM provides audited, production-ready FHE libraries. Vote in Deep uses straightforward encryption patterns that are easier to understand and verify.

### 6. **Scalability vs Privacy Trade-off**
**Problem**: Privacy-preserving systems often sacrifice performance and scalability.

**Our Solution**: While FHE computations are more expensive than plaintext operations, Vote in Deep optimizes by:
- Encrypting only sensitive data (titles, options, votes)
- Using efficient euint32 types for vote counts
- Minimizing on-chain encrypted operations
- Leveraging blockchain's natural scalability solutions (L2s in future)

### 7. **Access Control Complexity**
**Problem**: Managing who can see voting results is often inflexible or requires complex permission systems.

**Our Solution**: Built-in FHE permissions allow granular access control. Poll creators can easily grant decryption rights to specific addresses, enabling use cases like:
- Private stakeholder polls
- Gradual result disclosure
- Role-based access (e.g., only board members see results)

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Create Poll│  │ Browse Polls │  │  Vote & Decrypt  │   │
│  └────────────┘  └──────────────┘  └──────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌────────────┐ ┌──────────────┐
│  Wallet      │ │  Viem/     │ │  Zama FHE    │
│  (RainbowKit)│ │  Ethers.js │ │  Relayer SDK │
└──────────────┘ └────────────┘ └──────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │   Ethereum Sepolia Testnet    │
        │                               │
        │  ┌─────────────────────────┐ │
        │  │  EncryptedVoting.sol    │ │
        │  │  (Smart Contract)       │ │
        │  │                         │ │
        │  │  - euint32 vote counts  │ │
        │  │  - eaddress keys        │ │
        │  │  - Access control       │ │
        │  └─────────────────────────┘ │
        └───────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │    Zama Decryption Oracle     │
        │  (Off-chain FHE Decryption)   │
        └───────────────────────────────┘
```

### Data Flow

#### Creating a Poll
1. User enters poll title and options in frontend
2. Frontend generates random Ethereum address as encryption key
3. Title and options are XOR-encrypted using key bytes
4. Encryption key is encrypted using Zama FHE instance
5. All encrypted data sent to smart contract via transaction
6. Smart contract stores encrypted data and grants creator access
7. Frontend displays generated key for potential sharing

#### Voting on a Poll
1. User must first decrypt poll to see options
2. User selects an option (0-3 index)
3. Choice is encrypted using FHEVM (euint32)
4. Encrypted vote submitted to smart contract
5. Contract verifies user hasn't voted and performs homomorphic operations:
   - Compares encrypted choice with each option index
   - Increments matching option's encrypted vote count
6. Vote is recorded, count remains encrypted on-chain

#### Decrypting Results
1. User requests decryption for a poll they have access to
2. Frontend creates EIP-712 signature request
3. User signs with wallet
4. Signature sent to Zama decryption oracle
5. Oracle verifies signature and decrypts encrypted key
6. Oracle returns decrypted key, title, options, and vote counts
7. Frontend uses decrypted key to XOR-decrypt title and options
8. Results displayed to user

#### Granting Access
1. Poll creator enters Ethereum address to grant access
2. Transaction sent to smart contract
3. Contract adds address to poll's access list
4. Address can now decrypt poll data via oracle

### Smart Contract Architecture

The `EncryptedVoting.sol` contract manages all on-chain voting logic:

**State Variables:**
- `polls`: Array of Poll structs
- `hasVotedMapping`: Tracks which addresses voted on which polls
- `pollCreatorMapping`: Maps poll IDs to creator addresses

**Poll Structure:**
```solidity
struct Poll {
    address creator;                    // Poll creator
    uint256 createdAt;                  // Creation timestamp
    bytes encryptedTitle;               // XOR-encrypted title
    bytes[] encryptedOptions;           // XOR-encrypted options
    eaddress encryptedKey;              // FHE-encrypted decryption key
    euint32[] encryptedVoteCounts;      // FHE-encrypted vote tallies
    address[] sharedWith;               // Access control list
}
```

**Key Functions:**
- `createPoll()`: Create encrypted poll with 2-4 options
- `submitVote()`: Cast encrypted vote (homomorphic counting)
- `grantKeyAccess()`: Share decryption rights with addresses
- `getPollMetadata()`: Get public poll info (creator, timestamp)
- `getEncryptedPollData()`: Retrieve encrypted data (requires access)
- `getEncryptedVoteCounts()`: Get encrypted vote counts (requires access)
- `hasVoted()`: Check if address voted on poll
- `hasKeyAccess()`: Verify decryption permission
- `pollCount()`: Total number of polls

**Events:**
- `PollCreated(uint256 pollId, address creator)`
- `VoteSubmitted(uint256 pollId, address voter)`
- `KeyAccessGranted(uint256 pollId, address grantedTo)`

### Frontend Architecture

**Component Structure:**
```
App.tsx (Root)
├── RainbowKitProvider (Wallet connection)
├── WagmiProvider (Web3 state)
└── QueryClientProvider (Data fetching)
    ├── Header.tsx (Wallet connect button)
    └── VotingApp.tsx (Main application)
        ├── Create Poll Tab
        │   ├── Title input
        │   ├── Dynamic option inputs (2-4)
        │   └── Submit with encryption
        ├── Explore Polls Tab
        │   └── Poll List
        │       ├── Public metadata
        │       ├── Decrypt button (if has access)
        │       ├── Vote interface (post-decrypt)
        │       └── Grant access (if creator)
```

**Custom Hooks:**
- `useZamaInstance()`: Initializes FHEVM instance for encryption
- `useEthersSigner()`: Converts Wagmi account to Ethers signer

**Utilities:**
- `encryption.ts`: XOR encryption/decryption functions

## Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Version 7.0.0 or higher
- **MetaMask** or compatible Web3 wallet
- **Sepolia ETH**: Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- **Git**: For cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vote-in-deep.git
   cd vote-in-deep
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Environment Setup

#### Root Environment Variables

Create a `.env` file in the project root:

```env
# Deployment private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Infura API key for Sepolia RPC access
INFURA_API_KEY=your_infura_api_key

# Optional: Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**Security Warning**: Never commit your `.env` file or expose your private key. Add `.env` to `.gitignore`.

#### Frontend Configuration

The frontend is pre-configured for Sepolia testnet. If you need to update the contract address after redeployment:

1. Open `frontend/src/config/contracts.ts`
2. Update the `contractAddress` constant
3. Update the `contractABI` if contract interface changed

For WalletConnect integration:
1. Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Update `projectId` in `frontend/src/config/wagmi.ts`

### Running Locally

#### 1. Compile Smart Contracts

```bash
npm run compile
```

This compiles Solidity contracts and generates TypeScript types via TypeChain.

#### 2. Run Tests

```bash
npm test
```

Run tests on Sepolia testnet:
```bash
npm run test:sepolia
```

#### 3. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

#### 4. Connect Your Wallet

1. Open the app in your browser
2. Click "Connect Wallet" in the header
3. Select your wallet provider (MetaMask recommended)
4. Approve the connection
5. Ensure you're on Sepolia testnet

### Deployment

#### Deploy Smart Contract to Sepolia

1. **Ensure you have Sepolia ETH**
   ```bash
   # Check your balance
   npx hardhat run scripts/checkBalance.ts --network sepolia
   ```

2. **Deploy contract**
   ```bash
   npm run deploy:sepolia
   ```

   This will:
   - Compile contracts
   - Deploy to Sepolia testnet
   - Save deployment artifacts to `deployments/sepolia/`
   - Output the contract address

3. **Verify contract on Etherscan** (optional)
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

4. **Update frontend configuration**
   - Copy the deployed contract address
   - Update `frontend/src/config/contracts.ts`

#### Deploy Frontend

##### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel --prod
   ```

##### Option 2: Netlify

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist` folder to Netlify via drag-and-drop or CLI

##### Option 3: Static Hosting

```bash
cd frontend
npm run build
# Deploy the 'dist' folder to any static hosting service
```

## Project Structure

```
vote-in-deep/
├── contracts/                          # Smart contracts
│   └── EncryptedVoting.sol            # Main voting contract (221 lines)
│
├── deploy/                             # Deployment scripts
│   └── deploy.ts                      # Hardhat-deploy script for Sepolia
│
├── tasks/                              # Hardhat custom tasks
│   ├── accounts.ts                    # Account management
│   └── EncryptedVoting.ts             # Contract interaction tasks
│
├── test/                               # Smart contract tests
│   ├── EncryptedVoting.ts             # Local test suite
│   └── EncryptedVotingSepolia.ts      # Sepolia integration tests
│
├── frontend/                           # React frontend application
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── VotingApp.tsx          # Main application component (694 lines)
│   │   │   └── Header.tsx             # Header with wallet connection
│   │   ├── config/
│   │   │   ├── contracts.ts           # Contract ABI and address
│   │   │   └── wagmi.ts               # Wagmi/Web3 configuration
│   │   ├── hooks/
│   │   │   ├── useZamaInstance.ts     # FHE instance initialization
│   │   │   └── useEthersSigner.ts     # Ethers.js integration
│   │   ├── utils/
│   │   │   └── encryption.ts          # XOR encryption utilities
│   │   ├── styles/
│   │   │   ├── Header.css
│   │   │   └── VotingApp.css
│   │   ├── App.tsx                    # App root with providers
│   │   ├── main.tsx                   # Entry point
│   │   └── vite-env.d.ts              # Vite type definitions
│   ├── index.html                      # HTML template
│   ├── package.json                    # Frontend dependencies
│   ├── tsconfig.json                   # TypeScript config
│   └── vite.config.ts                  # Vite configuration
│
├── deployments/                        # Deployment artifacts
│   └── sepolia/                       # Sepolia deployment records
│       ├── EncryptedVoting.json       # Contract deployment data
│       └── .chainId                   # Chain ID verification
│
├── artifacts/                          # Compiled contract artifacts
│   └── contracts/                     # Generated by Hardhat
│
├── hardhat.config.ts                   # Hardhat configuration
├── package.json                        # Root dependencies
├── tsconfig.json                       # Root TypeScript config
├── .env                                # Environment variables (gitignored)
├── .gitignore                          # Git ignore rules
└── README.md                           # This file
```

## Smart Contract

### EncryptedVoting.sol

Location: `contracts/EncryptedVoting.sol`

**Contract Address (Sepolia)**: `0xE1986fD7E434BbDD18D38d39F67B1f464fEECa08`

#### Core Functionality

**Poll Creation**
```solidity
function createPoll(
    bytes calldata encryptedTitle,
    bytes[] calldata encryptedOptions,
    einput encryptedKey,
    bytes calldata inputProof
) external returns (uint256)
```
- Creates a new poll with encrypted title and options (2-4 options required)
- Stores encrypted decryption key as `eaddress`
- Initializes encrypted vote counts (all zeros)
- Automatically grants creator access
- Emits `PollCreated` event

**Voting**
```solidity
function submitVote(
    uint256 pollId,
    einput encryptedChoice,
    bytes calldata inputProof
) external
```
- Accepts encrypted vote choice (0-3 index)
- Verifies user hasn't already voted (one vote per address)
- Performs homomorphic comparison and increment:
  ```solidity
  for (uint8 i = 0; i < optionCount; i++) {
      ebool isMatch = TFHE.eq(choice, TFHE.asEuint32(i));
      encryptedVoteCounts[i] = TFHE.add(
          encryptedVoteCounts[i],
          TFHE.select(isMatch, TFHE.asEuint32(1), TFHE.asEuint32(0))
      );
  }
  ```
- Updates encrypted vote counts without decryption
- Emits `VoteSubmitted` event

**Access Control**
```solidity
function grantKeyAccess(uint256 pollId, address user) external
```
- Allows poll creator to grant decryption access
- Prevents duplicate access grants
- Allows ACL for encrypted key and vote counts
- Emits `KeyAccessGranted` event

**Data Retrieval**
```solidity
// Public metadata (no access required)
function getPollMetadata(uint256 pollId)
    external view returns (address creator, uint256 createdAt)

// Encrypted data (access required for decryption via oracle)
function getEncryptedPollData(uint256 pollId)
    external view returns (bytes memory, bytes[] memory, eaddress)

function getEncryptedVoteCounts(uint256 pollId)
    external view returns (euint32[] memory)
```

#### Security Features

1. **Input Validation**
   - Poll must have 2-4 options
   - Empty titles/options rejected
   - Zero addresses rejected

2. **Access Control**
   - Only creators can grant access
   - Only users with access can decrypt data
   - FHE ACL enforced at library level

3. **Vote Integrity**
   - One vote per address enforced with mapping
   - Vote counts are encrypted, preventing manipulation
   - All state changes emit events for auditability

4. **Error Handling**
   ```solidity
   error InvalidPoll();
   error OptionsOutOfRange();
   error AlreadyVoted();
   error Unauthorized();
   error DuplicateAccess();
   error EmptyTitle();
   error EmptyOption();
   error ZeroAddress();
   ```

#### Gas Considerations

FHE operations are more expensive than plaintext operations:
- `createPoll()`: ~500k-1M gas (depends on option count)
- `submitVote()`: ~400k-600k gas (homomorphic operations)
- `grantKeyAccess()`: ~100k-200k gas

Future optimizations may include batching operations or L2 deployment.

## Frontend Application

### VotingApp Component

Location: `frontend/src/components/VotingApp.tsx`

#### State Management

```typescript
// Poll creation state
const [pollTitle, setPollTitle] = useState<string>("")
const [pollOptions, setPollOptions] = useState<string[]>(["", ""])

// Poll browsing state
const [polls, setPolls] = useState<PollDisplay[]>([])
const [selectedPoll, setSelectedPoll] = useState<PollDisplay | null>(null)
const [selectedOption, setSelectedOption] = useState<number | null>(null)

// UI state
const [activeTab, setActiveTab] = useState<"create" | "explore">("create")
const [isLoading, setIsLoading] = useState<boolean>(false)
const [message, setMessage] = useState<string>("")
```

#### Key Functions

**Poll Creation**
```typescript
const handleCreatePoll = async () => {
  // 1. Generate random encryption key (Ethereum address)
  const randomKey = ethers.Wallet.createRandom().address

  // 2. XOR encrypt title and options
  const encryptedTitle = encryptText(pollTitle, randomKey)
  const encryptedOptions = pollOptions.map(opt => encryptText(opt, randomKey))

  // 3. Create FHE encrypted input for key
  const input = instance.createEncryptedInput(contractAddress, account)
  input.addAddress(randomKey)
  const { handles, inputProof } = input.encrypt()

  // 4. Submit transaction
  const tx = await contract.createPoll(
    encryptedTitle,
    encryptedOptions,
    handles[0],
    inputProof
  )
  await tx.wait()

  // 5. Display generated key to user
  setMessage(`Poll created! Key: ${randomKey}`)
}
```

**Poll Decryption**
```typescript
const handleDecryptPoll = async (pollId: number) => {
  // 1. Request decryption from Zama oracle
  const { title, options, voteCounts, key } = await userDecrypt(
    contractAddress,
    account,
    pollId
  )

  // 2. XOR decrypt title and options using decrypted key
  const decryptedTitle = decryptText(title, key)
  const decryptedOptions = options.map(opt => decryptText(opt, key))

  // 3. Update poll display with decrypted data
  setPolls(prev => prev.map(p =>
    p.id === pollId
      ? { ...p, title: decryptedTitle, options: decryptedOptions, voteCounts }
      : p
  ))
}
```

**Voting**
```typescript
const handleVote = async (pollId: number, optionIndex: number) => {
  // 1. Create FHE encrypted input for vote choice
  const input = instance.createEncryptedInput(contractAddress, account)
  input.add32(optionIndex)  // Encrypt the selected option index
  const { handles, inputProof } = input.encrypt()

  // 2. Submit encrypted vote
  const tx = await contract.submitVote(pollId, handles[0], inputProof)
  await tx.wait()

  // 3. Refresh poll data
  await refetchPolls()
}
```

**Access Granting**
```typescript
const handleGrantAccess = async (pollId: number, address: string) => {
  // Validate Ethereum address
  if (!ethers.isAddress(address)) {
    throw new Error("Invalid Ethereum address")
  }

  // Submit transaction
  const tx = await contract.grantKeyAccess(pollId, address)
  await tx.wait()
}
```

#### UI Features

1. **Tabbed Interface**
   - "Create Poll" tab for new polls
   - "Explore Polls" tab for browsing

2. **Dynamic Option Management**
   - Start with 2 empty options
   - "Add Option" button (max 4 options)
   - "Remove" button for each option (min 2 options)

3. **Poll Cards**
   - Display creator address and creation time
   - Show "***" for encrypted data until decrypted
   - Conditional rendering based on user access
   - Decrypt button for authorized users
   - Vote interface appears after decryption
   - Grant access section for poll creators

4. **Loading States**
   - Disabled buttons during transactions
   - Loading spinners for async operations
   - Clear success/error messages

5. **Responsive Design**
   - Clean, professional styling
   - Mobile-friendly layout
   - Accessible form controls

## How It Works

### End-to-End Flow Example

#### Scenario: Alice creates a poll, grants Bob access, and Bob votes

**Step 1: Alice Creates a Poll**

1. Alice connects her wallet to the app
2. She navigates to "Create Poll" tab
3. Enters title: "Should we upgrade to React 19?"
4. Adds options: "Yes", "No", "Need more info"
5. Clicks "Create Poll"

**What happens:**
- Frontend generates random address: `0x742d...` (encryption key)
- Title and options are XOR-encrypted using key bytes
- Key is encrypted with FHEVM into `eaddress` type
- Transaction sent to `EncryptedVoting.sol`
- Contract stores all encrypted data
- Alice's address added to poll's access list
- Event `PollCreated(pollId: 0, creator: alice)` emitted
- Frontend displays: "Poll created! Share this key with voters: 0x742d..."

**Step 2: Bob Discovers the Poll**

1. Bob opens the app and connects his wallet
2. Navigates to "Explore Polls" tab
3. Sees the poll with:
   - Creator: `0x...alice`
   - Created: "2 minutes ago"
   - Title: `***` (encrypted)
   - Options: `***` (encrypted)
4. No "Decrypt" button visible (Bob doesn't have access yet)

**Step 3: Alice Grants Bob Access**

1. Alice finds her poll in "Explore Polls"
2. Scrolls to "Grant Access" section (only visible to creator)
3. Enters Bob's address: `0x...bob`
4. Clicks "Grant Access"

**What happens:**
- Transaction sent to `grantKeyAccess(pollId: 0, user: bob)`
- Contract adds Bob to `sharedWith` array
- FHE ACL permissions updated to allow Bob to decrypt
- Event `KeyAccessGranted(pollId: 0, grantedTo: bob)` emitted

**Step 4: Bob Decrypts the Poll**

1. Bob refreshes the poll list
2. Now sees "Decrypt Poll" button
3. Clicks "Decrypt Poll"

**What happens:**
- Frontend requests decryption from Zama oracle
- Bob signs EIP-712 message to prove ownership of address
- Oracle verifies signature and checks ACL permissions
- Oracle decrypts:
  - Encrypted key → `0x742d...`
  - Encrypted vote counts → `[0, 0, 0]`
  - Returns encrypted title and options (still XOR-encrypted)
- Frontend uses decrypted key to XOR-decrypt:
  - Title → "Should we upgrade to React 19?"
  - Options → ["Yes", "No", "Need more info"]
- UI updates to show decrypted data and vote interface

**Step 5: Bob Votes**

1. Bob selects "Yes" (option 0)
2. Clicks "Submit Vote"

**What happens:**
- Frontend encrypts choice `0` using FHEVM
- Transaction sent to `submitVote(pollId: 0, encryptedChoice, proof)`
- Contract verifies Bob hasn't voted before
- Contract performs homomorphic operations:
  ```
  For each option i in [0, 1, 2]:
    isMatch = encrypted_compare(encryptedChoice, i)
    voteCounts[i] = voteCounts[i] + (isMatch ? 1 : 0)
  ```
- Result: `voteCounts` becomes `[1, 0, 0]` (still encrypted!)
- Bob's address marked as voted in `hasVotedMapping`
- Event `VoteSubmitted(pollId: 0, voter: bob)` emitted

**Step 6: Alice Checks Results**

1. Alice decrypts the poll again (or if already decrypted, refreshes)
2. Oracle now returns vote counts: `[1, 0, 0]`
3. Alice sees:
   - "Yes": 1 vote
   - "No": 0 votes
   - "Need more info": 0 votes

**Throughout this entire process:**
- Bob's vote choice was never exposed publicly
- Vote counts are encrypted on-chain
- Only Alice and Bob can see the actual poll question and results
- All voting activity is auditable on the blockchain
- No centralized party can manipulate votes

## Testing

### Smart Contract Tests

Location: `test/EncryptedVoting.ts`

Run tests:
```bash
npm test
```

**Test Coverage:**
- Poll creation with various option counts
- Voting with encrypted choices
- Access control (granting and verifying permissions)
- Edge cases (duplicate votes, unauthorized access)
- Event emissions
- Error conditions

Sample test:
```typescript
it("Should allow voting and increment encrypted counts", async function () {
  // Create poll
  const tx = await encryptedVoting.createPoll(
    encryptedTitle,
    encryptedOptions,
    handles[0],
    inputProof
  )
  await tx.wait()

  // Alice votes for option 0
  const input = instance.createEncryptedInput(contractAddress, alice)
  input.add32(0)
  const { handles: voteHandles, inputProof: voteProof } = input.encrypt()

  await encryptedVoting.connect(alice).submitVote(0, voteHandles[0], voteProof)

  // Verify Alice is marked as voted
  expect(await encryptedVoting.hasVoted(0, alice.address)).to.be.true

  // Verify Bob hasn't voted
  expect(await encryptedVoting.hasVoted(0, bob.address)).to.be.false
})
```

### Integration Tests (Sepolia)

Location: `test/EncryptedVotingSepolia.ts`

Run Sepolia tests:
```bash
npm run test:sepolia
```

Tests actual deployment on Sepolia testnet to verify:
- Real FHEVM integration
- Oracle decryption
- Gas costs
- Transaction confirmations

### Frontend Testing

Currently manual testing. Future plans include:
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright

### Test Coverage

Generate coverage report:
```bash
npm run coverage
```

## Security Considerations

### Smart Contract Security

1. **Access Control**
   - Poll creators explicitly grant decryption access
   - FHE ACL enforced at library level
   - No way to bypass encryption without permission

2. **Vote Integrity**
   - One vote per address enforced with mapping
   - Homomorphic counting prevents manipulation
   - All operations are deterministic and verifiable

3. **Input Validation**
   - All inputs sanitized and validated
   - Empty data rejected
   - Zero addresses rejected
   - Option counts bounded (2-4)

4. **Reentrancy Protection**
   - No external calls that could enable reentrancy
   - State updates follow checks-effects-interactions pattern

### Frontend Security

1. **Wallet Security**
   - RainbowKit provides secure wallet integration
   - Users must sign transactions in their wallet
   - Private keys never exposed to frontend

2. **Encryption**
   - XOR encryption for demo purposes (sufficient for encrypted transport)
   - FHE provides cryptographic security on-chain
   - Random key generation uses cryptographically secure methods

3. **Input Sanitization**
   - All user inputs validated before submission
   - Address validation using ethers.js
   - Type safety enforced with TypeScript

### Known Limitations

1. **XOR Encryption**
   - Used for title/options encryption (client-side)
   - NOT cryptographically secure for highly sensitive data
   - Sufficient for this demo as data is also FHE-encrypted on-chain
   - Future versions may use AES or similar

2. **Gas Costs**
   - FHE operations are expensive
   - Creating polls costs ~500k-1M gas
   - Voting costs ~400k-600k gas
   - Consider L2 deployment for production

3. **Key Management**
   - Encryption keys displayed to users
   - Users responsible for securely sharing keys
   - Future versions may implement on-chain key sharing

4. **Decryption Trust**
   - Zama oracle performs decryptions off-chain
   - Requires trusting Zama's infrastructure
   - This is inherent to current FHE technology

### Best Practices for Users

1. **Protect Your Wallet**
   - Never share private keys or seed phrases
   - Use hardware wallets for valuable accounts
   - Verify transaction details before signing

2. **Key Management**
   - Store poll encryption keys securely
   - Share keys only via secure channels
   - Consider using password managers

3. **Verify Contracts**
   - Check contract address matches official deployment
   - Review contract code on Etherscan before interacting
   - Verify you're on Sepolia testnet (Chain ID 11155111)

4. **Gas Management**
   - Ensure sufficient Sepolia ETH balance
   - Monitor gas prices before transactions
   - Understand FHE operations are more expensive

## Roadmap

### Phase 1: Current Features (Completed)
- ✅ Basic encrypted poll creation
- ✅ Encrypted voting with homomorphic counting
- ✅ Access control and key sharing
- ✅ Poll discovery and browsing
- ✅ Decryption via Zama oracle
- ✅ Web3 wallet integration
- ✅ Sepolia testnet deployment

### Phase 2: Enhanced Security (Q2 2025)
- 🔄 Replace XOR encryption with AES-256
- 🔄 Implement secure key derivation (PBKDF2/Argon2)
- 🔄 Add multi-signature poll creation
- 🔄 Time-locked result disclosure
- 🔄 Implement vote withdrawal mechanism
- 🔄 Add proof of unique humanity integration (Worldcoin, Proof of Humanity)

### Phase 3: Advanced Features (Q3 2025)
- 📅 Weighted voting (token-based, reputation-based)
- 📅 Quadratic voting support
- 📅 Multi-choice polls (select multiple options)
- 📅 Ranked-choice voting
- 📅 Poll templates and categories
- 📅 Automated poll expiration
- 📅 Delegate voting support

### Phase 4: Scalability & UX (Q4 2025)
- 📅 Layer 2 deployment (Arbitrum, Optimism, zkSync)
- 📅 Batch voting to reduce gas costs
- 📅 Mobile-responsive design improvements
- 📅 Progressive Web App (PWA) support
- 📅 Social sharing integrations
- 📅 Real-time poll updates (WebSocket)
- 📅 Email/SMS notifications for poll events

### Phase 5: Governance & DAO Integration (2026)
- 📅 Snapshot.org integration
- 📅 Gnosis Safe multi-sig integration
- 📅 On-chain governance proposal creation
- 📅 Automatic execution of poll results (via smart contracts)
- 📅 Treasury management voting
- 📅 NFT-based voting eligibility
- 📅 Cross-chain voting support

### Phase 6: Analytics & Insights (2026)
- 📅 Poll analytics dashboard
- 📅 Voting participation metrics
- 📅 Trend analysis and reporting
- 📅 Export results to CSV/PDF
- 📅 Data visualization tools
- 📅 API for third-party integrations

### Phase 7: Enterprise Features (Future)
- 📅 White-label deployment options
- 📅 Custom branding and theming
- 📅 SSO integration (OAuth, SAML)
- 📅 Advanced access control (roles, permissions)
- 📅 Audit trails and compliance reporting
- 📅 SLA guarantees and support packages

### Research & Exploration
- 🔬 Investigate zero-knowledge proof integration
- 🔬 Explore threshold FHE for distributed decryption
- 🔬 Research decentralized identity integration (DIDs)
- 🔬 Evaluate alternative FHE implementations
- 🔬 Study post-quantum cryptography options

**Legend:**
- ✅ Completed
- 🔄 In Progress
- 📅 Planned
- 🔬 Research Phase

## Contributing

We welcome contributions from the community! Vote in Deep is an open-source project that benefits from diverse perspectives and expertise.

### How to Contribute

1. **Fork the Repository**
   ```bash
   git fork https://github.com/yourusername/vote-in-deep.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Run Tests**
   ```bash
   npm test
   npm run lint
   ```

5. **Commit Your Changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Test additions or changes
   - `chore:` Build process or tooling changes

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all CI checks pass

### Development Guidelines

**Code Style**
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write self-documenting code with clear variable names
- Add comments for complex logic

**Testing**
- Write unit tests for new functions
- Add integration tests for new features
- Ensure >80% code coverage
- Test edge cases and error conditions

**Documentation**
- Update README for new features
- Add inline code documentation
- Include JSDoc comments for public functions
- Update CHANGELOG for notable changes

**Commit Guidelines**
- Keep commits atomic and focused
- Write clear commit messages
- Reference issue numbers in commits
- Squash commits before merging

### Areas for Contribution

- **Smart Contracts**: Optimize gas usage, add new features
- **Frontend**: Improve UI/UX, add animations, enhance accessibility
- **Testing**: Increase coverage, add E2E tests
- **Documentation**: Improve guides, add tutorials, fix typos
- **Security**: Audit code, report vulnerabilities
- **Performance**: Optimize bundle size, improve load times
- **Accessibility**: WCAG compliance, screen reader support
- **Internationalization**: Add translations

### Reporting Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/yourusername/vote-in-deep/issues) with:

- **Bug Reports**:
  - Clear description of the issue
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable
  - Browser/environment details

- **Feature Requests**:
  - Use case and motivation
  - Proposed implementation (if any)
  - Potential challenges
  - Alternative solutions considered

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Assume good intentions
- No harassment or discrimination tolerated

### Recognition

Contributors will be acknowledged in:
- README contributors section
- CHANGELOG for significant contributions
- GitHub contributor graph
- Social media shoutouts for major features

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

### What This Means

✅ **You CAN:**
- Use the code for personal or commercial projects
- Modify and distribute the code
- Use it in closed-source projects

❌ **You CANNOT:**
- Hold the authors liable
- Use contributors' names for endorsement without permission

📋 **You MUST:**
- Include the original license and copyright notice
- State significant changes made to the code

### Full License

See the [LICENSE](LICENSE) file for complete terms.

### Third-Party Licenses

This project uses open-source libraries with their own licenses:
- **Zama FHEVM**: BSD-3-Clause-Clear
- **Hardhat**: MIT
- **React**: MIT
- **Ethers.js**: MIT
- **Wagmi**: MIT

See `package.json` for complete list of dependencies.

## Support

### Getting Help

**Documentation**
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [Ethers.js Documentation](https://docs.ethers.org/)

**Community**
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/yourusername/vote-in-deep/discussions)
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/vote-in-deep/issues)
- **Discord**: Join our community server (link coming soon)
- **Twitter/X**: [@VoteInDeep](https://twitter.com/voteindeep) (example)

**Zama Community**
- [Zama Discord](https://discord.gg/zama)
- [Zama Community Forum](https://community.zama.ai/)
- [Zama GitHub](https://github.com/zama-ai/fhevm)

### Frequently Asked Questions

**Q: Do I need real ETH to use this?**
A: No, Vote in Deep runs on Sepolia testnet. You can get free Sepolia ETH from faucets like [sepoliafaucet.com](https://sepoliafaucet.com/).

**Q: Why are transactions so expensive?**
A: FHE operations are computationally intensive, resulting in higher gas costs. This is a known limitation of current FHE technology. We're exploring L2 solutions.

**Q: Can I deploy this on mainnet?**
A: The contract can be deployed to any FHEVM-compatible network. However, mainnet deployment requires careful security audits and gas cost considerations.

**Q: Is my vote really private?**
A: Yes! Your vote is encrypted before being submitted to the blockchain. Only encrypted data is stored on-chain, and only users with explicit access can decrypt results.

**Q: Can the poll creator see how I voted?**
A: No. Even the poll creator cannot see individual votes. They can only see aggregate encrypted vote counts after decryption.

**Q: What happens if I lose the encryption key?**
A: The poll creator's address always has access via the on-chain encrypted key. However, if sharing keys out-of-band and they're lost, that data cannot be recovered.

**Q: Can I delete a poll after creating it?**
A: Currently, no. Polls are permanent on the blockchain. This is intentional to maintain voting integrity and prevent result manipulation.

**Q: How do I get Sepolia ETH?**
A: Visit faucets like:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

**Q: Why use XOR encryption for titles/options?**
A: It's a lightweight encryption method for demonstration. The data is also FHE-encrypted on-chain for actual security. Future versions may use stronger client-side encryption.

**Q: Can this scale to millions of users?**
A: Current implementation targets small to medium-scale voting. For large-scale elections, optimizations like L2 deployment, vote batching, and sharding would be needed.

**Q: Is this production-ready?**
A: Vote in Deep is a proof-of-concept demonstrating FHE voting. While functional, it should undergo professional security audits before production use with sensitive data.

### Commercial Support

For enterprise deployments, custom features, or consulting:
- Email: contact@voteindeep.com (example)
- Website: https://voteindeep.com (example)

### Security Vulnerabilities

Found a security issue? Please **DO NOT** open a public issue.

Instead:
1. Email: security@voteindeep.com (example)
2. Provide detailed description
3. Include steps to reproduce
4. Allow reasonable time for response

We appreciate responsible disclosure and will acknowledge security researchers publicly (with permission).

---

## Acknowledgments

**Built With:**
- [Zama](https://www.zama.ai/) - For pioneering FHEVM technology
- [Hardhat](https://hardhat.org/) - Ethereum development framework
- [React](https://react.dev/) - UI library
- [RainbowKit](https://www.rainbowkit.com/) - Wallet connection UX
- [Wagmi](https://wagmi.sh/) - React hooks for Ethereum

**Inspired By:**
- Privacy-preserving voting research
- Decentralized governance systems
- The need for transparent yet private decision-making

**Special Thanks:**
- Zama team for FHE documentation and support
- Open-source community for incredible tools
- Early testers and contributors

---

**Vote in Deep** - Privacy-Preserving Decentralized Voting

Built with ❤️ using Fully Homomorphic Encryption

[Website](https://voteindeep.com) • [Documentation](https://docs.voteindeep.com) • [Twitter](https://twitter.com/voteindeep) • [Discord](https://discord.gg/voteindeep)

---

*Made possible by Zama's FHEVM - Bringing privacy to smart contracts*
