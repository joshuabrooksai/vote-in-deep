import { useMemo, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { Contract, getAddress, isAddress } from 'ethers';
import { Header } from './Header';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { decryptText, encryptText, generateKeyAddress } from '../utils/encryption';
import '../styles/VotingApp.css';

type HexString = `0x${string}`;

type PollRecord = {
  id: number;
  creator: string;
  createdAt: number;
  encryptedTitle: HexString;
  encryptedOptions: readonly HexString[];
  encryptedKey: HexString;
  voteCounts: readonly HexString[];
  hasVoted: boolean;
  hasAccess: boolean;
};

type DecryptedPoll = {
  key: HexString;
  title: string;
  options: string[];
  counts: number[];
};

function shortenAddress(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function formatTimestamp(seconds: number) {
  return new Date(seconds * 1000).toLocaleString();
}

function toNumber(value: string | undefined): number {
  if (!value) {
    return 0;
  }
  if (value.startsWith('0x')) {
    return Number(BigInt(value));
  }
  return Number(value);
}

function normalizeDecryptedKey(raw: string | undefined): HexString | null {
  if (!raw) {
    return null;
  }

  try {
    if (raw.startsWith('0x')) {
      return getAddress(raw) as HexString;
    }
    const hex = `0x${BigInt(raw).toString(16).padStart(40, '0')}`;
    return getAddress(hex) as HexString;
  } catch (error) {
    console.error('Failed to normalize decrypted key', error);
    return null;
  }
}

export function VotingApp() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const signer = useEthersSigner();
  const { instance, isLoading: isZamaLoading, error: zamaError } = useZamaInstance();

  const contractAddress = useMemo<HexString | null>(() => {
    try {
      return getAddress(CONTRACT_ADDRESS) as HexString;
    } catch (error) {
      console.error('Invalid contract address', error);
      return null;
    }
  }, []);

  const [activeTab, setActiveTab] = useState<'create' | 'explore'>('create');
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [shareTargets, setShareTargets] = useState<Record<number, string>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number | null>>({});
  const [decryptedPolls, setDecryptedPolls] = useState<Record<number, DecryptedPoll>>({});
  const [lastCreatedKey, setLastCreatedKey] = useState<HexString | null>(null);
  const [creating, setCreating] = useState(false);
  const [decryptingPoll, setDecryptingPoll] = useState<number | null>(null);
  const [votingPoll, setVotingPoll] = useState<number | null>(null);
  const [grantingPoll, setGrantingPoll] = useState<number | null>(null);

  const pollsQuery = useQuery<PollRecord[]>({
    queryKey: ['polls', contractAddress, address],
    enabled: Boolean(publicClient) && Boolean(contractAddress),
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!publicClient || !contractAddress) {
        return [];
      }

      const total = (await publicClient.readContract({
        address: contractAddress,
        abi: CONTRACT_ABI,
        functionName: 'pollCount',
      })) as bigint;

      const size = Number(total);
      if (size <= 0) {
        return [];
      }

      const items: PollRecord[] = [];
      for (let i = 0; i < size; i++) {
        const pollId = BigInt(i);
        const metadata = (await publicClient.readContract({
          address: contractAddress,
          abi: CONTRACT_ABI,
          functionName: 'getPollMetadata',
          args: [pollId],
        })) as readonly [string, bigint, bigint];

        const encrypted = (await publicClient.readContract({
          address: contractAddress,
          abi: CONTRACT_ABI,
          functionName: 'getEncryptedPollData',
          args: [pollId],
        })) as readonly [HexString, readonly HexString[], HexString];

        const voteCounts = (await publicClient.readContract({
          address: contractAddress,
          abi: CONTRACT_ABI,
          functionName: 'getEncryptedVoteCounts',
          args: [pollId],
        })) as readonly HexString[];

        let hasVoted = false;
        let hasAccess = false;

        if (address) {
          const walletAddress = address as HexString;
          hasVoted = (await publicClient.readContract({
            address: contractAddress,
            abi: CONTRACT_ABI,
            functionName: 'hasVoted',
            args: [pollId, walletAddress],
          })) as boolean;

          hasAccess = (await publicClient.readContract({
            address: contractAddress,
            abi: CONTRACT_ABI,
            functionName: 'hasKeyAccess',
            args: [pollId, walletAddress],
          })) as boolean;
        }

        items.push({
          id: i,
          creator: metadata[0],
          createdAt: Number(metadata[1]),
          encryptedTitle: encrypted[0] as HexString,
          encryptedOptions: encrypted[1] as readonly HexString[],
          encryptedKey: encrypted[2] as HexString,
          voteCounts: voteCounts as readonly HexString[],
          hasVoted,
          hasAccess,
        });
      }

      return items.sort((a, b) => b.createdAt - a.createdAt);
    },
  });

  const polls = pollsQuery.data ?? [];
  const isLoadingPolls = pollsQuery.isLoading || pollsQuery.isFetching;

  const addOption = () => {
    if (options.length >= 4) {
      return;
    }
    setOptions((prev) => [...prev, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      return;
    }
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((option, i) => (i === index ? value : option)));
  };

  const handleCreatePoll = async () => {
    if (!address) {
      alert('Connect your wallet to create a poll.');
      return;
    }

    if (!contractAddress) {
      alert('Contract address is not configured.');
      return;
    }

    if (!instance) {
      alert('Encryption service is still loading. Please try again in a moment.');
      return;
    }

    const signerInstance = await signer;
    if (!signerInstance) {
      alert('Signer not available. Please ensure your wallet is connected.');
      return;
    }

    const walletAddress = address as HexString;

    const trimmedTitle = title.trim();
    const trimmedOptions = options.map((option) => option.trim());

    if (!trimmedTitle) {
      alert('Please provide a poll title.');
      return;
    }

    if (trimmedOptions.some((option) => option.length === 0)) {
      alert('All poll options must be provided.');
      return;
    }

    if (trimmedOptions.length < 2 || trimmedOptions.length > 4) {
      alert('Polls must include between two and four options.');
      return;
    }

    try {
      setCreating(true);

      const keyAddress = generateKeyAddress();
      const encryptedTitle = encryptText(trimmedTitle, keyAddress);
      const encryptedOptions = trimmedOptions.map((option) => encryptText(option, keyAddress));

      const buffer = instance.createEncryptedInput(contractAddress, walletAddress);
      buffer.addAddress(keyAddress);
      const encryptedKey = await buffer.encrypt();

      const contract = new Contract(contractAddress, CONTRACT_ABI, signerInstance);

      const tx = await contract.createPoll(
        encryptedTitle,
        encryptedOptions,
        encryptedKey.handles[0],
        encryptedKey.inputProof
      );
      await tx.wait();

      setLastCreatedKey(keyAddress);
      setTitle('');
      setOptions(['', '']);
      setSelectedOptions({});
      setDecryptedPolls({});
      setActiveTab('explore');

      await pollsQuery.refetch();
    } catch (error) {
      console.error('Failed to create poll', error);
      alert(`Failed to create poll: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDecrypt = async (poll: PollRecord) => {
    if (!address) {
      alert('Connect your wallet to decrypt polls.');
      return;
    }

    if (!contractAddress) {
      alert('Contract address is not configured.');
      return;
    }

    if (!instance) {
      alert('Encryption service is still loading.');
      return;
    }

    const signerInstance = await signer;
    if (!signerInstance) {
      alert('Signer not available.');
      return;
    }

    const walletAddress = address as HexString;
    setDecryptingPoll(poll.id);

    try {
      const keypair = instance.generateKeypair();

      const uniqueHandles = new Set<HexString>([poll.encryptedKey]);
      poll.voteCounts.forEach((handle) => {
        uniqueHandles.add(handle);
      });

      const handleContractPairs = Array.from(uniqueHandles).map((handle) => ({
        handle,
        contractAddress,
      }));

      const startTimestamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';
      const contractAddresses = [contractAddress];

      const eip712 = instance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimestamp,
        durationDays
      );

      const signature = await signerInstance.signTypedData(
        eip712.domain,
        {
          UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
        },
        eip712.message
      );

      const result = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        walletAddress,
        startTimestamp,
        durationDays
      );

      const decryptedKey = normalizeDecryptedKey(result[poll.encryptedKey]);

      if (!decryptedKey) {
        alert('Unable to decrypt the poll key. Please check that you have access rights.');
        return;
      }

      const titleValue = decryptText(poll.encryptedTitle, decryptedKey);
      const optionValues = poll.encryptedOptions.map((option) => decryptText(option, decryptedKey));
      const countValues = poll.voteCounts.map((handle) => toNumber(result[handle]));

      setDecryptedPolls((prev) => ({
        ...prev,
        [poll.id]: {
          key: decryptedKey,
          title: titleValue,
          options: optionValues,
          counts: countValues,
        },
      }));
    } catch (error) {
      console.error('Failed to decrypt poll', error);
      alert(`Failed to decrypt poll: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDecryptingPoll(null);
    }
  };

  const handleGrantAccess = async (pollId: number) => {
    if (!contractAddress) {
      alert('Contract address is not configured.');
      return;
    }

    const target = shareTargets[pollId]?.trim();
    if (!target) {
      alert('Enter an address to grant access.');
      return;
    }

    if (!isAddress(target)) {
      alert('Provide a valid Ethereum address.');
      return;
    }

    const signerInstance = await signer;
    if (!signerInstance) {
      alert('Signer not available.');
      return;
    }

    setGrantingPoll(pollId);

    try {
      const contract = new Contract(contractAddress, CONTRACT_ABI, signerInstance);
      const tx = await contract.grantKeyAccess(pollId, getAddress(target));
      await tx.wait();

      setShareTargets((prev) => ({ ...prev, [pollId]: '' }));
      await pollsQuery.refetch();
    } catch (error) {
      console.error('Failed to grant key access', error);
      alert(`Failed to grant access: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setGrantingPoll(null);
    }
  };

  const handleVote = async (poll: PollRecord) => {
    if (!address) {
      alert('Connect your wallet before voting.');
      return;
    }

    if (!contractAddress) {
      alert('Contract address is not configured.');
      return;
    }

    if (!instance) {
      alert('Encryption service is still loading.');
      return;
    }

    const selection = selectedOptions[poll.id];
    if (selection === undefined || selection === null) {
      alert('Select an option before voting.');
      return;
    }

    const signerInstance = await signer;
    if (!signerInstance) {
      alert('Signer not available.');
      return;
    }

    const walletAddress = address as HexString;
    setVotingPoll(poll.id);

    try {
      const buffer = instance.createEncryptedInput(contractAddress, walletAddress);
      buffer.add32(selection);
      const encryptedVote = await buffer.encrypt();

      const contract = new Contract(contractAddress, CONTRACT_ABI, signerInstance);
      const tx = await contract.submitVote(
        poll.id,
        encryptedVote.handles[0],
        encryptedVote.inputProof
      );
      await tx.wait();

      setSelectedOptions((prev) => ({ ...prev, [poll.id]: null }));
      setDecryptedPolls((prev) => {
        const copy = { ...prev };
        delete copy[poll.id];
        return copy;
      });

      await pollsQuery.refetch();
    } catch (error) {
      console.error('Failed to submit vote', error);
      alert(`Failed to submit vote: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setVotingPoll(null);
    }
  };

  const renderCreateTab = () => (
    <div className="card">
      <h2 className="card-title">Create Encrypted Poll</h2>
      <p className="card-description">
        Titles, options, and vote counts stay encrypted on-chain. Share access by granting permissions to wallets you trust.
      </p>

      {isZamaLoading && <p className="muted-text">Initializing encryption runtime...</p>}

      <div className="form-group">
        <label className="form-label" htmlFor="poll-title">Poll Title</label>
        <input
          id="poll-title"
          type="text"
          className="form-input"
          placeholder="Enter confidential poll title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Poll Options</label>
        <div className="options-list">
          {options.map((option, index) => (
            <div key={index} className="option-row">
              <input
                type="text"
                className="form-input"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(event) => updateOption(index, event.target.value)}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => removeOption(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="link-button"
          onClick={addOption}
          disabled={options.length >= 4}
        >
          Add Option
        </button>
      </div>

      <button
        type="button"
        className="primary-button"
        onClick={handleCreatePoll}
        disabled={creating || !instance || isZamaLoading}
      >
        {creating ? 'Creating...' : 'Create Poll'}
      </button>

      {lastCreatedKey && (
        <div className="info-banner">
          <h3 className="info-title">Poll Key Generated</h3>
          <p className="info-text">
            Encrypted address stored on-chain: <span className="info-key">{lastCreatedKey}</span>
          </p>
          <p className="info-text">
            Grant access from the poll list so collaborators can decrypt and vote.
          </p>
        </div>
      )}
    </div>
  );

  const renderPollsTab = () => (
    <div className="polls-section">
      {isLoadingPolls && <p className="muted-text">Loading polls...</p>}
      {!isLoadingPolls && polls.length === 0 && (
        <p className="muted-text">No polls have been created yet.</p>
      )}

      {polls.map((poll) => {
        const decrypted = decryptedPolls[poll.id];
        const isCreator = address && poll.creator.toLowerCase() === address.toLowerCase();
        const canDecrypt = isCreator || poll.hasAccess;

        return (
          <div key={poll.id} className="poll-card">
            <div className="poll-header">
              <div>
                <span className="poll-label">Creator:</span> {shortenAddress(poll.creator)}
              </div>
              <div>
                <span className="poll-label">Created:</span> {formatTimestamp(poll.createdAt)}
              </div>
            </div>

            <div className="poll-body">
              <h3 className="poll-title">{decrypted ? decrypted.title : '***'}</h3>
              <ul className="option-list">
                {(decrypted ? decrypted.options : poll.encryptedOptions).map((option, index) => (
                  <li key={index} className="option-item">
                    <div className="option-main">
                      <span>{decrypted ? option : '***'}</span>
                      {decrypted && (
                        <span className="count-badge">Votes: {decrypted.counts[index] ?? 0}</span>
                      )}
                    </div>
                    {decrypted && !poll.hasVoted && address && (
                      <label className="vote-choice">
                        <input
                          type="radio"
                          name={`poll-${poll.id}`}
                          checked={selectedOptions[poll.id] === index}
                          onChange={() => setSelectedOptions((prev) => ({ ...prev, [poll.id]: index }))}
                        />
                        <span>Select</span>
                      </label>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="poll-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => handleDecrypt(poll)}
                disabled={decryptingPoll === poll.id || !canDecrypt || !instance || isZamaLoading}
              >
                {decryptingPoll === poll.id ? 'Decrypting...' : canDecrypt ? 'Decrypt Poll' : 'Access Required'}
              </button>

              {decrypted && !poll.hasVoted && address && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => handleVote(poll)}
                  disabled={votingPoll === poll.id || selectedOptions[poll.id] === null || selectedOptions[poll.id] === undefined}
                >
                  {votingPoll === poll.id ? 'Submitting...' : 'Submit Vote'}
                </button>
              )}

              {poll.hasVoted && <span className="muted-text">You already voted in this poll.</span>}
            </div>

            {isCreator && (
              <div className="grant-section">
                <label className="form-label">Grant Key Access</label>
                <div className="grant-row">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="0x follower address"
                    value={shareTargets[poll.id] ?? ''}
                    onChange={(event) =>
                      setShareTargets((prev) => ({ ...prev, [poll.id]: event.target.value }))
                    }
                  />
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleGrantAccess(poll.id)}
                    disabled={grantingPoll === poll.id}
                  >
                    {grantingPoll === poll.id ? 'Granting...' : 'Grant Access'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="voting-app">
      <Header />
      <main className="main-content">
        {!contractAddress && (
          <div className="warning-banner">
            <p>Contract address is not set. Update the configuration to continue.</p>
          </div>
        )}

        {zamaError && (
          <div className="warning-banner">
            <p>Encryption service error: {zamaError}</p>
          </div>
        )}

        <div className="tab-navigation">
          <nav className="tab-nav">
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`tab-button ${activeTab === 'create' ? 'active' : 'inactive'}`}
            >
              Create Poll
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`tab-button ${activeTab === 'explore' ? 'active' : 'inactive'}`}
            >
              Explore Polls
            </button>
          </nav>
        </div>

        {activeTab === 'create' ? renderCreateTab() : renderPollsTab()}
      </main>
    </div>
  );
}
