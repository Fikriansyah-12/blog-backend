import { config } from 'dotenv'

config()

export const jwtConstans = {
    secret: process.env.JWT_SECRET
}