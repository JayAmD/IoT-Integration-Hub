import VpnKeyIcon from "@mui/icons-material/VpnKey";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box, IconButton, Paper, Stack, Typography, Tooltip, Chip } from "@mui/material";
import { useState } from "react";

export default function CredentialListItem({
  credential,
  onEdit,
  onDelete,
  onReveal
}) {
  const [revealedSecret, setRevealedSecret] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const formattedDate = new Date(credential.createdAt).toLocaleDateString();

  const handleToggleReveal = async () => {
    if (revealedSecret) {
      setRevealedSecret(null);
      return;
    }

    setIsRevealing(true);
    try {
      const secret = await onReveal(credential._id);
      setRevealedSecret(secret);
    } catch (err) {
      // Error is handled by orchestrator/snackbar usually, 
      // but we log here for dev
      console.error("Failed to reveal secret", err);
    } finally {
      setIsRevealing(false);
    }
  };

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
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }} noWrap>
                {credential.name}
            </Typography>
            <Chip 
                label={`v${credential.keyVersion || 1}`} 
                size="small" 
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
            />
          </Stack>
          
          {revealedSecret ? (
            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'success.main', fontWeight: 600 }}>
                {revealedSecret}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" noWrap>
                Provider: {credential.provider}
            </Typography>
          )}
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
          <Tooltip title={revealedSecret ? "Hide Secret" : "Reveal Secret"}>
            <IconButton 
                onClick={handleToggleReveal} 
                size="small" 
                color="secondary"
                disabled={isRevealing}
            >
              {revealedSecret ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
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
