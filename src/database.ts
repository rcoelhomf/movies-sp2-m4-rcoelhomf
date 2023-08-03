import { Client } from 'pg'
import 'dotenv/config'

export const client: Client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
})

export const startDatabase = async () => {
    await client.connect()
    console.log('Database connected')
}