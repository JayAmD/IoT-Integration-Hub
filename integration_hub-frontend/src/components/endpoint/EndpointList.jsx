import { Stack, Typography, Box } from "@mui/material";
import EndpointListItem from "./EndpointListItem.jsx";

export default function EndpointList({
  endpoints,
  onEdit,
  onDelete,
  onToggleActive
}) {
  if (!endpoints || !endpoints.length) {
    return (
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No endpoints found.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Create your first webhook connector to start forwarding IoT data.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      {endpoints.map((endpoint) => (
        <EndpointListItem
          key={endpoint._id}
          endpoint={endpoint}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </Stack>
  );
}
