// src/services/encryptionFactory.ts
import { VaultTransitProvider } from "./vaultTransitProvider";
import type { EncryptionProvider } from "./encryption";

export function getEncryptionProvider(): EncryptionProvider {
  switch (process.env.ENCRYPTION_PROVIDER) {
    case "vault-transit":
      return new VaultTransitProvider();
    default:
      throw new Error(`Unknown provider: ${process.env.ENCRYPTION_PROVIDER}`);
  }
}