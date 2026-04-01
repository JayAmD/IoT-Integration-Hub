import { useParams } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";

export default function DeviceDetail() {
  const { deviceId } = useParams();

  return (
    <Box component="main" sx={{ flexGrow: 1, width: "100%", p: { xs: 2, md: 3 }, bgcolor: "grey.50", minHeight: "calc(100vh - 64px)" }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Device Detail
        </Typography>
        <Typography color="text.secondary">
          Selected device id: {deviceId}
        </Typography>
      </Paper>
    </Box>
  );
}

