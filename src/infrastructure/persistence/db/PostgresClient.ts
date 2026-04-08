import { Pool } from 'pg';
import { DbConfigProvider } from '../../services/DbConfigProvider';

export class PostgresClient {
  private pool: Pool;

  private constructor(pool: Pool) {
    this.pool = pool;
  }

  static async create(): Promise<PostgresClient> {
    const provider = new DbConfigProvider();
    const cfg = await provider.getConfig();

    const pool = new Pool({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
    });

    return new PostgresClient(pool);
  }

  async query<T = any>(text: string, params: any[] = []): Promise<{ rows: T[]; rowCount: number }> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(text, params);
      return { rows: res.rows, rowCount: res.rowCount ?? 0 };
    } finally {
      client.release();
    }
  }
}
