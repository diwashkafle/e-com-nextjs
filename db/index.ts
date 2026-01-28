import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";

// if(!process.env.DATABASE_URL){
//     throw new Error("DATABASE_URL is not available in .env file")
// }

const sql = neon("postgresql://neondb_owner:npg_HYmM1yAxocX9@ep-old-frost-ahtd44yk-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
export const db = drizzle(sql ,{schema});