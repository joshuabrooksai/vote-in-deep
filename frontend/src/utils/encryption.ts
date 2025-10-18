import { getAddress, getBytes, hexlify, toUtf8Bytes, toUtf8String, Wallet } from 'ethers';

function deriveKeyBytes(address: string): Uint8Array {
  const normalized = getAddress(address);
  return getBytes(normalized);
}

export function generateKeyAddress(): `0x${string}` {
  const wallet = Wallet.createRandom();
  return wallet.address as `0x${string}`;
}

export function encryptText(value: string, addressKey: string): `0x${string}` {
  const keyBytes = deriveKeyBytes(addressKey);
  const plainBytes = toUtf8Bytes(value);
  const encrypted = new Uint8Array(plainBytes.length);
  for (let index = 0; index < plainBytes.length; index++) {
    encrypted[index] = plainBytes[index] ^ keyBytes[index % keyBytes.length];
  }
  return hexlify(encrypted) as `0x${string}`;
}

export function decryptText(cipherHex: string, addressKey: string): string {
  if (cipherHex === '0x') {
    return '';
  }

  const keyBytes = deriveKeyBytes(addressKey);
  const cipherBytes = getBytes(cipherHex);
  const decrypted = new Uint8Array(cipherBytes.length);
  for (let index = 0; index < cipherBytes.length; index++) {
    decrypted[index] = cipherBytes[index] ^ keyBytes[index % keyBytes.length];
  }
  return toUtf8String(decrypted);
}
