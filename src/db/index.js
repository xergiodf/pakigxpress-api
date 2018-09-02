import mysql from 'promise-mysql'
import { env } from '../lib/env'
const pool = mysql.createPool({
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  host: env.DB_HOST,
  connectionLimit: 100
})
export default pool
