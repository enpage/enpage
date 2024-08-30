import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import * as os from "node:os";
import { fileURLToPath } from "node:url";
import type { CredentialsStore } from "./types";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

type JSONRecord = Record<string, string | number | boolean | null>;

class SecureStore<T extends JSONRecord> {
  private storePath: string;
  private keyPath: string;
  private saltPath: string;
  private algorithm = "aes-256-gcm";
  private keyLength = 32; // 256 bits
  private iterations = 100000; // Number of iterations for key derivation

  constructor(appName: string) {
    const configDir = path.join(os.homedir(), `.${appName}`);
    this.storePath = path.join(configDir, "store.enc");

    // Storing key and salt in node_modules
    const nodeModulesDir = this.findNearestNodeModules();
    if (!nodeModulesDir) {
      throw new Error("Unable to locate node_modules directory");
    }

    const tmpSecureStoreDir = path.join(nodeModulesDir, ".enpage-tmp");
    this.keyPath = path.join(tmpSecureStoreDir, "key");
    this.saltPath = path.join(tmpSecureStoreDir, "salt");

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
    }
    if (!fs.existsSync(nodeModulesDir)) {
      fs.mkdirSync(nodeModulesDir, { recursive: true, mode: 0o700 });
    }
  }

  private getKeyAndSalt(): { key: Buffer; salt: Buffer } {
    if (!fs.existsSync(this.keyPath) || !fs.existsSync(this.saltPath)) {
      const key = crypto.randomBytes(this.keyLength);
      const salt = crypto.randomBytes(16);
      fs.writeFileSync(this.keyPath, key, { mode: 0o600 });
      fs.writeFileSync(this.saltPath, salt, { mode: 0o600 });
      return { key, salt };
    }
    return {
      key: fs.readFileSync(this.keyPath),
      salt: fs.readFileSync(this.saltPath),
    };
  }

  private deriveKey(salt: Buffer): Buffer {
    const { key } = this.getKeyAndSalt(); // Get the stored key
    return crypto.pbkdf2Sync(key, salt, this.iterations, this.keyLength, "sha512");
  }

  private encrypt(data: string): string {
    const { salt } = this.getKeyAndSalt();
    const key = this.deriveKey(salt);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv) as crypto.CipherGCM;
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();
    return `${iv.toString("hex")}:${salt.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
  }

  private decrypt(data: string): string {
    const [ivHex, saltHex, encryptedData, authTagHex] = data.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const salt = Buffer.from(saltHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const key = this.deriveKey(salt);
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv) as crypto.DecipherGCM;
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  public get(key: keyof T): T[keyof T] | undefined {
    if (!fs.existsSync(this.storePath)) {
      return undefined;
    }
    const encryptedData = fs.readFileSync(this.storePath, "utf8");
    const decryptedData = this.decrypt(encryptedData);
    const store = JSON.parse(decryptedData) as T;
    return store[key];
  }

  public put(keyOrObject: keyof T | JSONRecord, value?: T[keyof T]): void {
    let store: T;
    if (fs.existsSync(this.storePath)) {
      const encryptedData = fs.readFileSync(this.storePath, "utf8");
      const decryptedData = this.decrypt(encryptedData);
      store = JSON.parse(decryptedData) as T;
    } else {
      store = {} as T;
    }
    if (typeof keyOrObject === "object") {
      Object.assign(store, keyOrObject);
    } else if (value !== undefined) {
      store[keyOrObject] = value;
    }
    const encryptedData = this.encrypt(JSON.stringify(store));
    fs.writeFileSync(this.storePath, encryptedData, { mode: 0o600 });
  }

  public delete(key: keyof T): void {
    if (!fs.existsSync(this.storePath)) {
      return;
    }
    const encryptedData = fs.readFileSync(this.storePath, "utf8");
    const decryptedData = this.decrypt(encryptedData);
    const store = JSON.parse(decryptedData) as T;
    delete store[key];
    const updatedEncryptedData = this.encrypt(JSON.stringify(store));
    fs.writeFileSync(this.storePath, updatedEncryptedData, { mode: 0o600 });
  }

  public clear(): void {
    if (fs.existsSync(this.storePath)) fs.unlinkSync(this.storePath);
    if (fs.existsSync(this.keyPath)) fs.unlinkSync(this.keyPath);
    if (fs.existsSync(this.saltPath)) fs.unlinkSync(this.saltPath);
  }

  private findNearestNodeModules(): string | null {
    let currentDir = __dirname;
    while (currentDir !== path.parse(currentDir).root) {
      const nodeModulesPath = path.join(currentDir, "node_modules");
      if (fs.existsSync(nodeModulesPath)) {
        return nodeModulesPath;
      }
      currentDir = path.dirname(currentDir);
    }
    return null;
  }
}

export const credentialsStore = new SecureStore<CredentialsStore>("enpage");
