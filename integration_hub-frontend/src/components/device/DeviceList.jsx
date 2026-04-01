import { Stack, Typography } from "@mui/material";
import DeviceListItem from "./DeviceListItem.jsx";

export default function DeviceList({
  devices,
  onOpenDetail,
  onOpenMessages,
}) {
  if (!devices.length) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        No devices match your current filters.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5} sx={{ mt: 2 }}>
      {devices.map((device) => (
        <DeviceListItem
          key={device.id}
          device={device}
          onOpenDetail={onOpenDetail}
          onOpenMessages={onOpenMessages}
        />
      ))}
    </Stack>
  );
}

