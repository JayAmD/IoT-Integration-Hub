import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Paper, Stack, Typography, Chip } from "@mui/material";

export default function MessageListItem({ message, onOpenDetail }) {
  const statusColors = {
    pending: "warning",
    delivered: "success",
    failed: "error"
  };

  const formattedDate = new Date(message.receivedAt).toLocaleString();

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
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            Received at
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>
            {formattedDate}
          </Typography>
        </Box>

        <Box sx={{ minWidth: { xs: 100, md: 150 }, textAlign: "left" }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            Serial number
          </Typography>
          <Typography variant="body1" noWrap>
            {message.serialNumber}
          </Typography>
        </Box>

        <Box sx={{ minWidth: { xs: 100, md: 120 }, textAlign: "center" }}>
          <Chip 
            label={message.status} 
            size="small" 
            color={statusColors[message.status] || "default"}
            sx={{ fontWeight: 600, textTransform: "capitalize" }}
          />
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: 200, px: 2 }}>
            <Typography variant="body2" color="text.secondary" noWrap>
                Data Preview
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic' }} noWrap>
                {JSON.stringify(message.data).substring(0, 40)}...
            </Typography>
        </Box>

        <IconButton
          aria-label="View Details"
          onClick={() => onOpenDetail(message)}
          size="small"
          color="primary"
          sx={{ ml: 1 }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
}
