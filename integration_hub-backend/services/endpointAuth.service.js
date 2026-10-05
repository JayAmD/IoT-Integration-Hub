import Credential from '../models/credential.model.js';
import { decrypt } from './secretManager.service.js';
import { getToken } from './externalAuthToken.service.js';

export async function getEndpointAuthHeaders(credentialId, tenantId) {
    if (!credentialId) return {};
    if (!tenantId) throw new Error('Tenant is required to prepare endpoint authentication.');

    const credential = await Credential.findOne({ _id: credentialId, tenantId })
        .select('+encryptedAuthorizationHeaderValue');
    if (!credential) throw new Error('Credential not found in this tenant.');

    switch (credential.authType) {
        case 'staticHeader':
            if (!credential.authorizationHeaderKey) {
                throw new Error('Static Header credential has no header name.');
            }
            return {
                [credential.authorizationHeaderKey]: decrypt(credential.encryptedAuthorizationHeaderValue)
            };
        case 'tokenLogin': {
            const token = await getToken(credentialId, tenantId);
            return { Authorization: `Bearer ${token}` };
        }
        default:
            throw new Error('Unsupported credential authentication type.');
    }
}
