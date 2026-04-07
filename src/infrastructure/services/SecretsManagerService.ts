import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export class SecretsManagerService {
  private client: SecretsManagerClient;

  constructor(client?: SecretsManagerClient) {
    this.client = client ?? new SecretsManagerClient({});
  }

  async getSecretString(secretId: string): Promise<string> {
    if (!secretId) throw new Error('Secret id is required');

    const cmd = new GetSecretValueCommand({ SecretId: secretId });
    const res = await this.client.send(cmd);
    const s = res.SecretString;
    if (!s) throw new Error(`Secret ${secretId} not found or has no SecretString`);
    return s;
  }

  async getSecretJson<T = any>(secretId: string): Promise<T> {
    const s = await this.getSecretString(secretId);
    try {
      return JSON.parse(s) as T;
    } catch (err) {
      throw new Error(`Secret ${secretId} contains invalid JSON`);
    }
  }
}
