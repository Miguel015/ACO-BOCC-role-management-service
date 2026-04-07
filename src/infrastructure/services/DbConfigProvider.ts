import { ParameterStoreService } from './ParameterStoreService';
import { SecretsManagerService } from './SecretsManagerService';

type DbConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

let cachedDbConfig: DbConfig | null = null;
let inFlightPromise: Promise<DbConfig> | null = null;

export class DbConfigProvider {
  private parameterService: ParameterStoreService;
  private secretsService: SecretsManagerService;

  constructor(parameterService?: ParameterStoreService, secretsService?: SecretsManagerService) {
    this.parameterService = parameterService ?? new ParameterStoreService();
    this.secretsService = secretsService ?? new SecretsManagerService();
  }

  async getConfig(): Promise<DbConfig> {
    if (cachedDbConfig) return cachedDbConfig;
    if (inFlightPromise) return inFlightPromise;

    inFlightPromise = this.loadConfig();
    try {
      const cfg = await inFlightPromise;
      cachedDbConfig = cfg;
      return cfg;
    } finally {
      inFlightPromise = null;
    }
  }

  private async loadConfig(): Promise<DbConfig> {
    const ssmParamName = process.env.SSM_DB_SECRET_ARN_PARAM;
    if (!ssmParamName) throw new Error('Missing required env SSM_DB_SECRET_ARN_PARAM');

    const dbName = process.env.DB_NAME;
    if (!dbName) throw new Error('Missing required env DB_NAME');

    const secretArn = await this.parameterService.getDecryptedParameter(ssmParamName);
    if (!secretArn) throw new Error(`Parameter ${ssmParamName} did not contain a secret ARN`);

    const secretJson = await this.secretsService.getSecretJson<Record<string, any>>(secretArn);

    const host = secretJson.DB_HOST ?? secretJson.host;
    const portRaw = secretJson.DB_PORT ?? secretJson.port;
    const user = secretJson.DB_USER ?? secretJson.user ?? secretJson.username;
    const password = secretJson.DB_PASSWORD ?? secretJson.password ?? secretJson.PASSWORD;

    if (!host) throw new Error('DB_HOST missing in secret');
    if (!portRaw) throw new Error('DB_PORT missing in secret');
    const port = Number(portRaw);
    if (Number.isNaN(port) || port <= 0) throw new Error('DB_PORT in secret is invalid');
    if (!user) throw new Error('DB_USER missing in secret');
    if (typeof password === 'undefined') throw new Error('DB_PASSWORD missing in secret');

    return { host, port, user, password, database: dbName };
  }

  // helper for tests
  static clearCacheForTests(): void {
    cachedDbConfig = null;
    inFlightPromise = null;
  }
}
