import crypto from 'crypto';

import Credential from '../models/credential.model.js';
import {API_KEYS_MASTER_KEY} from '../config/env.js';

// API_KEYS_MASTER_KEY for local encryption of API keys
// This key MUST be 32 bytes (256 bits) long.
if (!API_KEYS_MASTER_KEY) {
    throw new Error("API_KEYS_MASTER_KEY is not set in .env file");
}

if (API_KEYS_MASTER_KEY.length !== 32) {
    throw new Error(`Master key must be exactly 32 bytes. Check your API_KEYS_MASTER_KEY environment variable.`);
}

export const encrypt = (plainText) => {
    const algorithm = "aes-256-gcm";
    const iv = crypto.randomBytes(12); // AES-GCM standard IV size
    // Convert the string key from .env into a raw binary Buffer
    const key = Buffer.from(API_KEYS_MASTER_KEY, 'utf-8');

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let ciphertext = cipher.update(plainText, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    const tag = cipher.getAuthTag().toString('hex');

    // We must return all three parts to be able to decrypt later.
    return {
        ciphertext,
        iv: iv.toString('hex'),
        tag,
    };
};

export const decrypt = (encryptedData) => {
    const {ciphertext, iv, tag} = encryptedData;
    
    // Convert the string key from .env into a raw binary Buffer
    const key = Buffer.from(API_KEYS_MASTER_KEY, 'utf-8');

    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        Buffer.from(iv, 'hex')
    );

    // The authentication tag is crucial for security.
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    let plainText = decipher.update(ciphertext, 'hex', 'utf8');
    plainText += decipher.final('utf8');

    return plainText;
};

 //A facade function to get a secret's value.
 //This makes the system extensible to upgrade to Azure Key Vault in the future.

export const getSecretValue = async (credentialId) => {
    const credential = await Credential.findById(credentialId).select("+encryptedData") ;
    if (!credential) {
        throw new Error(`Credential with ID ${credentialId} not found.`);
    }

    return decrypt(credential.encryptedData);
};