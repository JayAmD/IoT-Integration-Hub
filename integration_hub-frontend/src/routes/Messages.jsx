import { useSearchParams } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";

export default function Messages() {
  const [searchParams] = useSearchParams();
  const selectedDeviceId = searchParams.get("deviceId");

  return (
    <Box component="main" sx={{ flexGrow: 1, width: "100%", p: { xs: 2, md: 3 }, bgcolor: "grey.50", minHeight: "calc(100vh - 64px)" }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Messages
        </Typography>
        <Typography color="text.secondary">
          {selectedDeviceId
            ? `Filtered by device: ${selectedDeviceId}`
            : "No device filter selected."}
        </Typography>
      </Paper>
    </Box>
  );
}

