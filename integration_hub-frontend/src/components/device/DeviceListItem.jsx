import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";

export default function DeviceListItem({
  device,
  onOpenDetail,
  onOpenMessages,
}) {
  const handleMessagesClick = (event) => {
    event.stopPropagation();
    onOpenMessages(device.id);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenDetail(device.id);
    }
  };

  return (
    <Paper
      elevation={0}
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetail(device.id)}
      onKeyDown={handleKeyDown}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "primary.50",
        px: { xs: 1.5, md: 2.5 },
        py: { xs: 1.5, md: 2 },
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: 1,
          transform: "translateY(-1px)",
        },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: "2px",
        },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontSize: { xs: "1.05rem", md: "1.2rem" } }} noWrap>
            {device.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {device.groupName}
          </Typography>
        </Box>

        <Box sx={{ minWidth: { xs: 110, md: 180 }, textAlign: "left" }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            Serial number
          </Typography>
          <Typography variant="body1" noWrap>
            {device.serialNumber}
          </Typography>
        </Box>

        <Box sx={{ minWidth: { xs: 110, md: 170 }, textAlign: "right" }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            Last seen
          </Typography>
          <Typography variant="body1" noWrap>
            {device.lastSeenLabel}
          </Typography>
        </Box>

        <IconButton
          aria-label={`Open messages for ${device.name}`}
          onClick={handleMessagesClick}
          size="small"
          sx={{ ml: { xs: 0.5, md: 1 } }}
        >
          <ChatBubbleOutlineIcon color="primary" fontSize="small" />
        </IconButton>

        <ChevronRightIcon color="action" fontSize="small" />
      </Stack>
    </Paper>
  );
}

