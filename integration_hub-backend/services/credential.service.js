import mongoose from 'mongoose';
import Credential from '../models/credential.model.js';
import { encrypt } from './secretManager.service.js';

const fail = message => { throw Object.assign(new Error(message), { statusCode: 400 }); };

export function buildCredentialData(input) {
    const data = {
        name: input.name,
        authType: input.authType
    };

    switch (input.authType) {
        case 'staticHeader':
            data.authorizationHeaderKey = input.authorizationHeaderKey;
            data.encryptedAuthorizationHeaderValue = encrypt(input.authorizationHeaderValue);
            break;
        case 'tokenLogin':
            data.encryptedClientId = encrypt(input.clientId);
            data.encryptedClientSecret = encrypt(input.clientSecret);
            data.loginEndpoint = input.loginEndpoint;
            data.loginTemplate = input.loginTemplate;
            data.responseTokenKey = input.responseTokenKey;
            break;
    }

    return data;
}

export function publicCredential(credential) {
    const data = credential.toObject();
    delete data.encryptedAuthorizationHeaderValue;
    delete data.encryptedClientId;
    delete data.encryptedClientSecret;
    return data;
}

export async function validateCredentialBelongsToTenant(credentialId, tenantId) {
    if (credentialId === undefined || credentialId === null) return;
    if (typeof credentialId !== 'string' || !mongoose.isObjectIdOrHexString(credentialId)) {
        fail('credentialId must be a valid identifier or null.');
    }
    if (!await Credential.exists({ _id: credentialId, tenantId })) {
        fail('Credential not found in this tenant.');
    }
}
