/**
 * HaLo NFC Tag Integration
 * 
 * This module provides functions to interact with HaLo NFC tags using the libhalo library.
 * Supports getting tag info, signing messages, and EIP-712 typed data signing.
 * 
 * @see https://github.com/arx-research/libhalo
 */

import { execHaloCmdWeb } from '@arx-research/libhalo/api/web';

/**
 * HaLo command response types
 */
export interface HaloPublicKeys {
  publicKeys: {
    [keyNo: string]: string; // Uncompressed hex-encoded public key (65 bytes)
  };
  compressedPublicKeys?: {
    [keyNo: string]: string; // Compressed hex-encoded public key (33 bytes)
  };
  etherAddresses?: {
    [keyNo: string]: string; // Ethereum addresses
  };
}

export interface HaloSignature {
  raw: {
    r: string;
    s: string;
    v: number; // Recovery parameter (27 or 28)
  };
  der: string; // DER encoded signature
  ether: string; // Ethereum-formatted signature
}

export interface HaloSignResponse {
  input: {
    keyNo: number;
    digest: string; // 32 bytes, hex encoded
    message?: string; // Optional, hex encoded
    typedData?: any; // Optional, EIP-712 typed data
  };
  signature: HaloSignature;
  publicKey: string; // 65 bytes, hex encoded, uncompressed
  etherAddress: string;
}

export interface HaloKeyInfo {
  keyState: {
    isPasswordProtected: boolean;
  };
  publicKey: string; // Uncompressed, 65 bytes hex
  attestSig: string; // Attestation signature
}

export interface HaloDataStruct {
  isPartial: boolean;
  data: {
    [key: string]: string | null;
  };
}

/**
 * Get public keys from the HaLo tag
 * 
 * Retrieves public keys #1, #2, and #3 (if generated) from the tag.
 * 
 * @returns Promise with public keys, compressed keys, and Ethereum addresses
 * @throws Error if the command fails
 */
export async function getHaloInfo(): Promise<HaloPublicKeys> {
  try {
    const result = await execHaloCmdWeb({
      name: 'get_pkeys',
    });

    return result as HaloPublicKeys;
  } catch (error) {
    console.error('Failed to get HaLo info:', error);
    throw new Error('Failed to read HaLo tag. Please try again.');
  }
}

/**
 * Get detailed information about a specific key slot
 * 
 * @param keyNo - Key slot number (1, 2, or 3)
 * @returns Promise with key information including password protection status
 * @throws Error if the command fails
 */
export async function getHaloKeyInfo(keyNo: number = 1): Promise<HaloKeyInfo> {
  try {
    const result = await execHaloCmdWeb({
      name: 'get_key_info',
      keyNo,
    });

    return result as HaloKeyInfo;
  } catch (error) {
    console.error(`Failed to get key info for slot ${keyNo}:`, error);
    throw new Error(`Failed to get key info for slot ${keyNo}.`);
  }
}

/**
 * Sign a message using EIP-191 (personal_sign)
 * 
 * @param message - Message to sign (hex encoded or text)
 * @param keyNo - Key slot number to use (default: 1)
 * @param format - Format of the message: 'hex' or 'text' (default: 'hex')
 * @param password - Optional password for password-protected key slots
 * @param publicKeyHex - Optional public key (required when using password)
 * @returns Promise with signature and related data
 * @throws Error if signing fails
 */
export async function signMessage(
  message: string,
  keyNo: number = 1,
  format: 'hex' | 'text' = 'hex',
  password?: string,
  publicKeyHex?: string
): Promise<HaloSignResponse> {
  try {
    const command: any = {
      name: 'sign',
      message,
      format,
      keyNo,
    };

    if (password) {
      if (!publicKeyHex) {
        throw new Error('publicKeyHex is required when using password');
      }
      command.password = password;
      command.publicKeyHex = publicKeyHex;
    }

    const result = await execHaloCmdWeb(command);
    return result as HaloSignResponse;
  } catch (error) {
    console.error('Failed to sign message:', error);
    throw new Error('Failed to sign message with HaLo tag.');
  }
}

/**
 * Sign raw 32-byte digest using plain ECDSA
 * 
 * @param digest - Raw 32-byte digest to sign (hex encoded)
 * @param keyNo - Key slot number to use (default: 1)
 * @param password - Optional password for password-protected key slots
 * @param publicKeyHex - Optional public key (required when using password)
 * @returns Promise with signature and related data
 * @throws Error if signing fails
 */
export async function signDigest(
  digest: string,
  keyNo: number = 1,
  password?: string,
  publicKeyHex?: string
): Promise<HaloSignResponse> {
  try {
    // Validate digest length (must be 32 bytes = 64 hex characters)
    if (digest.replace('0x', '').length !== 64) {
      throw new Error('Digest must be exactly 32 bytes (64 hex characters)');
    }

    const command: any = {
      name: 'sign',
      digest: digest.replace('0x', ''),
      keyNo,
    };

    if (password) {
      if (!publicKeyHex) {
        throw new Error('publicKeyHex is required when using password');
      }
      command.password = password;
      command.publicKeyHex = publicKeyHex;
    }

    const result = await execHaloCmdWeb(command);
    return result as HaloSignResponse;
  } catch (error) {
    console.error('Failed to sign digest:', error);
    throw new Error('Failed to sign digest with HaLo tag.');
  }
}

/**
 * Sign typed data according to EIP-712
 * 
 * @param typedData - EIP-712 typed data object with domain, types, and value
 * @param keyNo - Key slot number to use (default: 1)
 * @param password - Optional password for password-protected key slots
 * @param publicKeyHex - Optional public key (required when using password)
 * @returns Promise with signature and related data
 * @throws Error if signing fails
 * 
 * @example
 * const typedData = {
 *   domain: {
 *     name: "My App",
 *     version: "1",
 *     chainId: 1,
 *     verifyingContract: "0x..."
 *   },
 *   types: {
 *     Person: [
 *       { name: "name", type: "string" },
 *       { name: "wallet", type: "address" }
 *     ],
 *     Mail: [
 *       { name: "from", type: "Person" },
 *       { name: "to", type: "Person" },
 *       { name: "contents", type: "string" }
 *     ]
 *   },
 *   value: {
 *     from: { name: "Alice", wallet: "0x..." },
 *     to: { name: "Bob", wallet: "0x..." },
 *     contents: "Hello!"
 *   }
 * };
 */
export async function signTypedData(
  typedData: {
    domain: Record<string, any>;
    types: Record<string, Array<{ name: string; type: string }>>;
    value: Record<string, any>;
  },
  keyNo: number = 1,
  password?: string,
  publicKeyHex?: string
): Promise<HaloSignResponse> {
  try {
    const command: any = {
      name: 'sign',
      typedData,
      keyNo,
    };

    if (password) {
      if (!publicKeyHex) {
        throw new Error('publicKeyHex is required when using password');
      }
      command.password = password;
      command.publicKeyHex = publicKeyHex;
    }

    const result = await execHaloCmdWeb(command);
    return result as HaloSignResponse;
  } catch (error) {
    console.error('Failed to sign typed data:', error);
    throw new Error('Failed to sign typed data with HaLo tag.');
  }
}

/**
 * Batch retrieve data from the HaLo tag
 * 
 * @param spec - Comma-separated list of objects to query (e.g., "publicKey:1,publicKey:2")
 * @returns Promise with queried data
 * @throws Error if the command fails
 * 
 * @example
 * // Get public keys for slots 1 and 2
 * const data = await getHaloDataStruct("publicKey:1,publicKey:2");
 * 
 * // Get compressed public key and attest signature
 * const data = await getHaloDataStruct("compressedPublicKey:1,publicKeyAttest:1");
 */
export async function getHaloDataStruct(spec: string): Promise<HaloDataStruct> {
  try {
    const result = await execHaloCmdWeb({
      name: 'get_data_struct',
      spec,
    });

    return result as HaloDataStruct;
  } catch (error) {
    console.error('Failed to get data struct:', error);
    throw new Error('Failed to retrieve data from HaLo tag.');
  }
}

/**
 * Utility: Format Ethereum address from public key
 * 
 * @param publicKey - Uncompressed public key (65 bytes hex)
 * @returns Shortened Ethereum address (0x1234...5678)
 */
export function formatEthAddress(address: string): string {
  if (!address) return '';
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Utility: Verify if a string is a valid hex
 * 
 * @param str - String to verify
 * @returns True if valid hex string
 */
export function isValidHex(str: string): boolean {
  return /^(0x)?[0-9a-fA-F]+$/.test(str);
}

/**
 * Utility: Convert text to hex
 * 
 * @param text - Text to convert
 * @returns Hex encoded string
 */
export function textToHex(text: string): string {
  return Buffer.from(text, 'utf8').toString('hex');
}

/**
 * Utility: Convert hex to text
 * 
 * @param hex - Hex string to convert
 * @returns Decoded text
 */
export function hexToText(hex: string): string {
  return Buffer.from(hex.replace('0x', ''), 'hex').toString('utf8');
}

/**
 * Error messages for common HaLo errors
 */
export const HALO_ERROR_MESSAGES = {
  ERROR_CODE_INVALID_KEY_NO: 'Invalid key number or the key slot doesn\'t support this operation',
  ERROR_CODE_KEY_NOT_INITIALIZED: 'The target key is not initialized yet',
  ERROR_CODE_INVALID_LENGTH: 'Invalid data length provided',
  ERROR_CODE_INVALID_DATA: 'Invalid data or trying to use standard command against password-protected slot',
  ERROR_CODE_WRONG_PWD: 'Wrong password provided',
  ERROR_CODE_CRYPTO_ERROR: 'Cryptographic operation failed',
  ERROR_CODE_KEY_ALREADY_EXISTS: 'Key already exists in this slot',
} as const;
