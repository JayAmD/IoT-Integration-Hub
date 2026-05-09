import { Stack, Typography } from "@mui/material";
import CredentialListItem from "./CredentialListItem.jsx";

export default function CredentialList({
  credentials,
  onEdit,
  onDelete,
}) {
  if (!credentials.length) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
        No credentials found. Create one to get started!
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5} sx={{ mt: 1 }}>
      {credentials.map((credential) => (
        <CredentialListItem
          key={credential._id}
          credential={credential}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
}
