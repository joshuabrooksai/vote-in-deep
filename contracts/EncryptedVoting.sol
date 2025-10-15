// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {
    FHE,
    eaddress,
    euint32,
    ebool,
    externalEaddress,
    externalEuint32
} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract EncryptedVoting is SepoliaConfig {
    struct Poll {
        address creator;
        uint256 createdAt;
        bytes encryptedTitle;
        bytes[] encryptedOptions;
        eaddress encryptedKey;
        euint32[] encryptedVoteCounts;
        address[] sharedWith;
    }

    Poll[] private _polls;

    mapping(uint256 => mapping(address => bool)) private _hasVoted;
    mapping(uint256 => mapping(address => bool)) private _keyAccess;

    event PollCreated(uint256 indexed pollId, address indexed creator);
    event KeyAccessGranted(uint256 indexed pollId, address indexed account);
    event VoteSubmitted(uint256 indexed pollId, address indexed voter);

    error InvalidPoll(uint256 pollId);
    error DuplicateAccess(address account);
    error AlreadyVoted(address account);
    error OptionsOutOfRange(uint256 length);
    error EmptyTitle();
    error EmptyOption(uint256 index);
    error Unauthorized(address caller);
    error ZeroAddress();

    function createPoll(
        bytes calldata encryptedTitle,
        bytes[] calldata encryptedOptions,
        externalEaddress encryptedKey,
        bytes calldata keyProof
    ) external returns (uint256 pollId) {
        uint256 optionLength = encryptedOptions.length;

        if (encryptedTitle.length == 0) {
            revert EmptyTitle();
        }

        if (optionLength < 2 || optionLength > 4) {
            revert OptionsOutOfRange(optionLength);
        }

        Poll storage poll = _polls.push();
        poll.creator = msg.sender;
        poll.createdAt = block.timestamp;
        poll.encryptedTitle = encryptedTitle;

        for (uint256 i = 0; i < optionLength; ++i) {
            if (encryptedOptions[i].length == 0) {
                revert EmptyOption(i);
            }

            poll.encryptedOptions.push(encryptedOptions[i]);
            poll.encryptedVoteCounts.push(FHE.asEuint32(0));
            FHE.allowThis(poll.encryptedVoteCounts[i]);
            FHE.allow(poll.encryptedVoteCounts[i], msg.sender);
        }

        eaddress encryptedAddressKey = FHE.fromExternal(encryptedKey, keyProof);
        poll.encryptedKey = encryptedAddressKey;
        FHE.allowThis(encryptedAddressKey);
        FHE.allow(encryptedAddressKey, msg.sender);

        pollId = _polls.length - 1;
        poll.sharedWith.push(msg.sender);
        _keyAccess[pollId][msg.sender] = true;

        emit PollCreated(pollId, msg.sender);
    }

    function grantKeyAccess(uint256 pollId, address account) external {
        if (pollId >= _polls.length) {
            revert InvalidPoll(pollId);
        }

        Poll storage poll = _polls[pollId];
        if (poll.creator != msg.sender) {
            revert Unauthorized(msg.sender);
        }

        if (account == address(0)) {
            revert ZeroAddress();
        }

        if (_keyAccess[pollId][account]) {
            revert DuplicateAccess(account);
        }

        _keyAccess[pollId][account] = true;
        poll.sharedWith.push(account);

        FHE.allow(poll.encryptedKey, account);

        uint256 optionLength = poll.encryptedVoteCounts.length;
        for (uint256 i = 0; i < optionLength; ++i) {
            FHE.allow(poll.encryptedVoteCounts[i], account);
        }

        emit KeyAccessGranted(pollId, account);
    }

    function submitVote(uint256 pollId, externalEuint32 encryptedChoice, bytes calldata choiceProof) external {
        if (pollId >= _polls.length) {
            revert InvalidPoll(pollId);
        }

        if (_hasVoted[pollId][msg.sender]) {
            revert AlreadyVoted(msg.sender);
        }

        Poll storage poll = _polls[pollId];
        uint256 optionLength = poll.encryptedOptions.length;

        euint32 choice = FHE.fromExternal(encryptedChoice, choiceProof);
        euint32 one = FHE.asEuint32(1);
        euint32 zero = FHE.asEuint32(0);

        for (uint256 i = 0; i < optionLength; ++i) {
            ebool isSelected = FHE.eq(choice, FHE.asEuint32(uint32(i)));
            euint32 increment = FHE.select(isSelected, one, zero);
            euint32 updatedCount = FHE.add(poll.encryptedVoteCounts[i], increment);

            poll.encryptedVoteCounts[i] = updatedCount;

            FHE.allowThis(poll.encryptedVoteCounts[i]);

            uint256 sharedLength = poll.sharedWith.length;
            for (uint256 j = 0; j < sharedLength; ++j) {
                FHE.allow(poll.encryptedVoteCounts[i], poll.sharedWith[j]);
            }
        }

        _hasVoted[pollId][msg.sender] = true;

        emit VoteSubmitted(pollId, msg.sender);
    }

    function pollCount() external view returns (uint256) {
        return _polls.length;
    }

    function getPollMetadata(uint256 pollId)
        external
        view
        returns (address creator, uint256 createdAt, uint256 optionCount)
    {
        if (pollId >= _polls.length) {
            revert InvalidPoll(pollId);
        }

        Poll storage poll = _polls[pollId];
        return (poll.creator, poll.createdAt, poll.encryptedOptions.length);
    }

    function getEncryptedPollData(uint256 pollId)
        external
        view
        returns (bytes memory encryptedTitle, bytes[] memory encryptedOptions, eaddress encryptedKey)
    {
        if (pollId >= _polls.length) {
            revert InvalidPoll(pollId);
        }

        Poll storage poll = _polls[pollId];
        uint256 optionLength = poll.encryptedOptions.length;

        bytes[] memory optionsCopy = new bytes[](optionLength);
        for (uint256 i = 0; i < optionLength; ++i) {
            optionsCopy[i] = poll.encryptedOptions[i];
        }

        return (poll.encryptedTitle, optionsCopy, poll.encryptedKey);
    }

    function getEncryptedVoteCounts(uint256 pollId) external view returns (euint32[] memory counts) {
        if (pollId >= _polls.length) {
            revert InvalidPoll(pollId);
        }

        Poll storage poll = _polls[pollId];
        uint256 optionLength = poll.encryptedVoteCounts.length;
        counts = new euint32[](optionLength);

        for (uint256 i = 0; i < optionLength; ++i) {
            counts[i] = poll.encryptedVoteCounts[i];
        }
    }

    function hasVoted(uint256 pollId, address account) external view returns (bool) {
        if (pollId >= _polls.length) {
            revert InvalidPoll(pollId);
        }

        return _hasVoted[pollId][account];
    }

    function hasKeyAccess(uint256 pollId, address account) external view returns (bool) {
        if (pollId >= _polls.length) {
            revert InvalidPoll(pollId);
        }

        return _keyAccess[pollId][account];
    }
}
