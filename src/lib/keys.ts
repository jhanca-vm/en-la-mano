import { generateKeyPairSync } from 'node:crypto'

export const { privateKey, publicKey } = generateKeyPairSync('ed25519')
