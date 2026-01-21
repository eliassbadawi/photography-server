import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const pgClient = new pg.Client(process.env.DATABASE_URL);

pgClient.on('error', (err) => console.error(err));

export default pgClient;