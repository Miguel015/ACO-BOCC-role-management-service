import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

export class ParameterStoreService {
  private client: SSMClient;

  constructor(client?: SSMClient) {
    this.client = client ?? new SSMClient({});
  }

  async getDecryptedParameter(name: string): Promise<string> {
    if (!name) throw new Error('Parameter name is required');

    const cmd = new GetParameterCommand({ Name: name, WithDecryption: true });
    const res = await this.client.send(cmd);
    const val = res.Parameter?.Value;
    if (!val) throw new Error(`Parameter ${name} not found or has no value`);
    return val;
  }
}
