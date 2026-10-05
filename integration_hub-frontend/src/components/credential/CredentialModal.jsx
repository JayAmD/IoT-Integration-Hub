import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Stack, Typography, Alert
} from '@mui/material';

export default function CredentialModal({ open, onClose, onSave, credential }) {
  const [formData, setFormData] = useState({
    name: credential?.name || '',
    authType: credential ? credential.authType : 'staticHeader',
    authorizationHeaderKey: credential?.authorizationHeaderKey || '',
    authorizationHeaderValue: '',
    clientId: '',
    clientSecret: '',
    loginEndpoint: credential?.loginEndpoint || '',
    loginTemplate: credential?.loginTemplate || '',
    responseTokenKey: credential?.responseTokenKey || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const changeField = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    const publicFields = formData.authType === 'staticHeader'
      ? ['name', 'authorizationHeaderKey']
      : ['name', 'loginEndpoint', 'loginTemplate', 'responseTokenKey'];
    const secretFields = formData.authType === 'staticHeader'
      ? ['authorizationHeaderValue']
      : ['clientId', 'clientSecret'];
    const dataToSave = credential ? {} : { authType: formData.authType };
    for (const field of publicFields) {
      if (!credential || formData[field] !== (credential[field] || '')) {
        dataToSave[field] = formData[field];
      }
    }
    for (const field of secretFields) {
      if (!credential || formData[field] !== '') dataToSave[field] = formData[field];
    }
    try {
      if (Object.keys(dataToSave).length) await onSave(dataToSave);

      onClose();

    } catch (err) {
      setError(err.message || 'Failed to save credential.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const secretField = (field, label, placeholder) => (
    <TextField label={label} fullWidth required={!credential} type="password"
      value={formData[field]} onChange={changeField(field)} autoComplete="new-password"
      placeholder={placeholder}
      helperText={credential ? 'Leave blank to keep the current value.' : undefined} />
  );

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {credential ? 'Edit Credential' : 'Add New Credential'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Friendly Name" fullWidth required value={formData.name}
              onChange={changeField('name')} placeholder="e.g. Production API" />
            <FormControl fullWidth required disabled={Boolean(credential)}>
              <InputLabel id="credential-auth-type-label">Authentication Type</InputLabel>
              <Select labelId="credential-auth-type-label" value={formData.authType}
                label="Authentication Type" onChange={changeField('authType')}>
                <MenuItem value="staticHeader">Static Header</MenuItem>
                <MenuItem value="tokenLogin">Token Login</MenuItem>
              </Select>
            </FormControl>
            {credential && <Typography variant="caption" color="text.secondary">
              To use another authentication type, create a new credential and assign it to the endpoint.
            </Typography>}
            {formData.authType === 'staticHeader' && <>
              <TextField label="Authorization Header Key" fullWidth required
                value={formData.authorizationHeaderKey} onChange={changeField('authorizationHeaderKey')}
                placeholder="X-API-Key or Authorization" />
              {secretField('authorizationHeaderValue', 'Authorization Header Value', 'Bearer YOUR_TOKEN')}
              <Typography variant="body2" color="text.secondary">
                For Bearer authentication, use Authorization as the key and include Bearer followed by a space and the token in the value.
              </Typography>
            </>}
            {formData.authType === 'tokenLogin' && <>
              {secretField('clientId', 'Client ID')}
              {secretField('clientSecret', 'Client Secret')}
              <TextField label="Login Endpoint" fullWidth required value={formData.loginEndpoint}
                onChange={changeField('loginEndpoint')} placeholder="https://api.example.com/login"
                helperText="The HTTPS address that receives the login request." />
              <TextField label="Login Template" fullWidth required multiline minRows={4}
                value={formData.loginTemplate} onChange={changeField('loginTemplate')}
                placeholder={'{\n  "username": "{{clientId}}",\n  "password": "{{clientSecret}}"\n}'}
                helperText={'Keep "{{clientId}}" and "{{clientSecret}}" exactly as shown, including the quotation marks and double curly braces, as complete field values. Change only the field names (such as username and password) to match the external API. Enter your actual credentials in the Client ID and Client Secret fields above; they will be inserted automatically.'} />
              <TextField label="Response Token Key" fullWidth required value={formData.responseTokenKey}
                onChange={changeField('responseTokenKey')} placeholder="access_token"
                helperText="The top-level response field containing the token, for example accessToken or id_token." />
              <Typography variant="body2" color="text.secondary">
                The filled Login Template is sent as the JSON body of a POST request to the Login Endpoint.
                <br />
                <br />
                When forwarding device messages to the target applications, the hub adds this returned token to the Authorization header with the Bearer prefix.
              </Typography>
            </>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={isSubmitting} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ borderRadius: 2, px: 3 }}>
            {isSubmitting ? 'Saving...' : 'Save Credential'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
