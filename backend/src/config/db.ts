import chalk from "chalk";
import { Pool } from "pg";

const pool = new Pool({
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'isisPasswords',
    user: process.env.DB_USER || 'postgres',
    password:process.env.DB_PASS || '',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

pool.on('connect', () => {
    console.log("connected in database");
});

pool.on('error', (err) => {
    console.log(chalk.red(err));
});

export default pool;