import { pool } from './db.js';

const [resultado] = await pool.query('SELECT 1 + 1 AS resultado');

console.log(resultado);