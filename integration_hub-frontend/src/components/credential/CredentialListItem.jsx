import VpnKeyIcon from "@mui/icons-material/VpnKey";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Paper, Stack, Typography, Tooltip } from "@mui/material";

export default function CredentialListItem({
  credential,
  onEdit,
  onDelete,
}) {
  const formattedDate = new Date(credential.createdAt).toLocaleDateString();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        px: { xs: 1.5, md: 2.5 },
        py: { xs: 1.5, md: 2 },
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: 1,
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box 
          sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: 'primary.50', 
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <VpnKeyIcon />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }} noWrap>
            {credential.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Provider: {credential.provider}
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', mr: 2 }}>
           <Typography variant="body2" color="text.secondary">
             Created on
           </Typography>
           <Typography variant="body2" fontWeight={500}>
             {formattedDate}
           </Typography>
        </Box>

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton onClick={() => onEdit(credential)} size="small" color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => onDelete(credential._id)} size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
