// src/services/vaultTransitProvider.ts
import axios from "axios";
import type { EncryptionProvider } from "./encryption";

export class VaultTransitProvider implements EncryptionProvider {
  private baseUrl = process.env.VAULT_ADDR!;
  private token   = process.env.VAULT_TOKEN!;

  private hdrs() {
    return { "X-Vault-Token": this.token };
  }

  async encrypt(plaintext: Buffer): Promise<Buffer> {
    const res = await axios.post(
      `${this.baseUrl}/v1/transit/encrypt/cipherflags-key`,
      { plaintext: plaintext.toString("base64") },
      { headers: this.hdrs() }
    );
    // vault:v1:<base64>; split and decode
    const ctB64 = res.data.data.ciphertext.split(":")[2];
    return Buffer.from(ctB64, "base64");
  }

  async decrypt(ciphertext: Buffer): Promise<Buffer> {
    const ctB64 = ciphertext.toString("base64");
    const res = await axios.post(
      `${this.baseUrl}/v1/transit/decrypt/cipherflags-key`,
      { ciphertext: `vault:v1:${ctB64}` },
      { headers: this.hdrs() }
    );
    return Buffer.from(res.data.data.plaintext, "base64");
  }
}
