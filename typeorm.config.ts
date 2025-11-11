import { config } from "dotenv"
import { DataSource } from "typeorm"

config()

export default new DataSource({
type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? '1234567',
      database: process.env.DB_NAME ?? 'article',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      synchronize: false,
      entities: ['dist/**/entities/*.entity{.ts,.js}'],
      migrations: ['dist/src/migrations/*{.ts,.js}'],
})