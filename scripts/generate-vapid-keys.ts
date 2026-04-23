/* eslint-disable no-console */
/**
 * Generate a VAPID keypair for Web Push and echo the env-file snippet you
 * need to paste into your .env / .env.local.
 *
 * Run once per environment:  npm run pwa:vapid
 */
import webpush from 'web-push'

const keys = webpush.generateVAPIDKeys()

console.log('\n==== Web Push VAPID keys ====')
console.log('Add these to your .env (NEVER commit the private key):\n')
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`)
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`)
console.log('VAPID_SUBJECT=mailto:admin@your-domain.com')
console.log('\n-----------------------------\n')
