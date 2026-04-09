import { encrypt, decrypt } from "../../../utils/encryption";

describe("encryption utility", () => {
  it("encrypts and decrypts a string correctly", () => {
    const plaintext = "https://discord.com/api/webhooks/123456/abcdef";
    const encrypted = encrypt(plaintext);
    expect(encrypted).not.toBe(plaintext);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it("produces different ciphertext for the same plaintext (random IV)", () => {
    const plaintext = "same-input-string";
    const enc1 = encrypt(plaintext);
    const enc2 = encrypt(plaintext);
    expect(enc1).not.toBe(enc2);
    expect(decrypt(enc1)).toBe(plaintext);
    expect(decrypt(enc2)).toBe(plaintext);
  });

  it("handles empty string", () => {
    const encrypted = encrypt("");
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe("");
  });

  it("handles long strings", () => {
    const plaintext = "a".repeat(1000);
    const encrypted = encrypt(plaintext);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it("throws on tampered ciphertext", () => {
    const encrypted = encrypt("test");
    const tampered = encrypted.slice(0, -2) + "XX";
    expect(() => decrypt(tampered)).toThrow();
  });
});
