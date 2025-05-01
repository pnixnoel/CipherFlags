// src/services/encryption.ts
export interface EncryptionProvider {
    encrypt(plaintext: Buffer): Promise<Buffer>;
    decrypt?(ciphertext: Buffer): Promise<Buffer>;
  }
