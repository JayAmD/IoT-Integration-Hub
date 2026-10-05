import Credential from '../../models/credential.model.js';
import { publicCredential } from '../../services/credential.service.js';
import { encrypt } from '../../services/secretManager.service.js';

const updateCredential = async (req, res, next) => {
    try {
        const credential = await Credential.findOne({
            _id: req.params.id, tenantId: req.currentTenant._id
        });
        if (!credential) {
            throw Object.assign(new Error('Credential not found'), { statusCode: 404 });
        }
        const input = req.body;
        if (input.name !== undefined) credential.name = input.name;
        if (input.authType !== undefined && input.authType !== credential.authType) {
            const error = new Error('Authentication type cannot be changed. Create a new credential instead.');
            error.statusCode = 400;
            throw error;
        }

        switch (credential.authType) {
            case 'staticHeader':
                if (input.authorizationHeaderKey !== undefined) {
                    credential.authorizationHeaderKey = input.authorizationHeaderKey;
                }
                if (input.authorizationHeaderValue !== undefined) {
                    credential.encryptedAuthorizationHeaderValue = encrypt(input.authorizationHeaderValue);
                }
                break;
            case 'tokenLogin':
                if (input.clientId !== undefined) {
                    credential.encryptedClientId = encrypt(input.clientId);
                }
                if (input.clientSecret !== undefined) {
                    credential.encryptedClientSecret = encrypt(input.clientSecret);
                }
                if (input.loginEndpoint !== undefined) credential.loginEndpoint = input.loginEndpoint;
                if (input.loginTemplate !== undefined) credential.loginTemplate = input.loginTemplate;
                if (input.responseTokenKey !== undefined) credential.responseTokenKey = input.responseTokenKey;
                break;
        }
        credential.keyVersion += 1;
        await credential.save();
        res.status(200).json({ success: true, data: publicCredential(credential) });
    } catch (error) {
        if (error.name === 'VersionError') {
            return next(Object.assign(new Error('Credential changed; reload it before editing.'), { statusCode: 409 }));
        }
        next(error);
    }
};

export default updateCredential;
