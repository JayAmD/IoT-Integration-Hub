import Credential from '../models/credential.model.js';
import { decrypt } from './secretManager.service.js';
import { fillLoginTemplate } from '../helpers/fillLoginTemplate.js';

// Perform one login and return its token. Caching and retries are possible extensions of the work.
export async function getToken(credentialId, tenantId) {
    if (!credentialId || !tenantId) {
        throw new Error('Credential and tenant identifiers are required to obtain a token.');
    }
    const credential = await Credential.findOne({ _id: credentialId, tenantId })
        .select('+encryptedClientId +encryptedClientSecret');

    if (!credential) throw new Error('Credential not found in this tenant.');
    if (credential.authType !== 'tokenLogin') {
        throw new Error('This credential does not use Token Login.');
    }

    // Do not transmit login secrets over plaintext HTTP or follow redirects. TODO
    let loginUrl;
    try {
        loginUrl = new URL(credential.loginEndpoint);
        if (loginUrl.protocol !== 'https:' || loginUrl.username || loginUrl.password) throw new Error();
    } catch {
        throw new Error('Token Login requires an HTTPS endpoint without embedded credentials.');
    }

    let clientId;
    let clientSecret;
    try {
        clientId = decrypt(credential.encryptedClientId);
        clientSecret = decrypt(credential.encryptedClientSecret);
    } catch {
        throw new Error('Unable to decrypt Token Login credentials.');
    }
    const body = fillLoginTemplate(credential.loginTemplate, { clientId, clientSecret });

    let response;
    try {
        response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            redirect: 'error',
            signal: AbortSignal.timeout(10000)
        });
    } catch {
        throw new Error('Token Login request failed: network error, timeout or redirect.');
    }

    if (!response.ok) throw new Error(`Token Login failed with HTTP ${response.status}.`);

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error('Token Login response is not valid JSON.');
    }
    const token = result && Object.hasOwn(result, credential.responseTokenKey)
        ? result[credential.responseTokenKey] : undefined;
    if (typeof token !== 'string' || !token.trim()) {
        throw new Error('Token Login response does not contain a usable token in the configured field.');
    }

    return token;
}
