import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Paper, Stack, Typography, Tooltip } from "@mui/material";

export default function MessageListItem({ message, onViewDetail }) {
  const statusColors = {
    pending: "#ed6c02", // warning.main
    delivered: "#2e7d32", // success.main
    failed: "#d32f2f" // error.main
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
        cursor: 'pointer',
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: 1,
          bgcolor: 'grey.50'
        }
      }}
      onClick={() => onViewDetail(message._id)}
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

        <Box sx={{ minWidth: { xs: 80, md: 120 }, textAlign: "left" }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            Serial number
          </Typography>
          <Typography variant="body1" noWrap>
            {message.serialNumber}
          </Typography>
        </Box>

        {/* Dispatch Tracker (The Dots) */}
        <Box sx={{ minWidth: { xs: 80, md: 120 }, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 0.5 }}>
            Dispatches
          </Typography>
          <Stack direction="row" spacing={0.5} justifyContent="center">
            {message.dispatches && message.dispatches.length > 0 ? (
              message.dispatches.map((d, idx) => (
                <Tooltip 
                  key={idx} 
                  title={`${d.endpointId?.name || 'Unknown Endpoint'}: ${d.status.toUpperCase()}`}
                  arrow
                >
                  <Box 
                    sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      bgcolor: statusColors[d.status] || 'grey.400' 
                    }} 
                  />
                </Tooltip>
              ))
            ) : (
              <Typography variant="caption" color="text.disabled">No targets</Typography>
            )}
          </Stack>
        </Box>

        <Box sx={{ display: { xs: 'none', lg: 'block' }, flex: 1, px: 2 }}>
            <Typography variant="body2" color="text.secondary" noWrap>
                Data Preview
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic' }} noWrap>
                {JSON.stringify(message.data).substring(0, 60)}...
            </Typography>
        </Box>

        <IconButton
          aria-label="View Details"
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
