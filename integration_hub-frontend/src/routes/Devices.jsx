import { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DevicesHeader from "../components/device/DevicesHeader.jsx";
import DeviceList from "../components/device/DeviceList.jsx";

const MOCK_DEVICES = [
  {
    id: "humidity-iot",
    name: "Humidity IoT",
    serialNumber: "SN-HUM-00428",
    groupName: "Forest nodes",
    lastSeenAt: "2026-02-04T09:30:00Z",
    lastSeenLabel: "4.2.2026 - 9:30",
  },
  {
    id: "vibration-cnc-1",
    name: "Vibration meter - CNC 1",
    serialNumber: "SN-CNC-99107",
    groupName: "Preemptive maintenance",
    lastSeenAt: "2026-02-04T09:25:00Z",
    lastSeenLabel: "4.2.2026 - 9:25",
  },
  {
    id: "greenhouse-temp-7",
    name: "Greenhouse temp sensor 7",
    serialNumber: "SN-GH-11842",
    groupName: "Greenhouse",
    lastSeenAt: "2026-02-03T16:11:00Z",
    lastSeenLabel: "3.2.2026 - 16:11",
  },
];

export default function Devices() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("name-asc");
  const [groupFilter, setGroupFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  const handleAddDevice = () => {
    // Hook this up to a modal or route when device creation flow is ready.
    console.log("Add device clicked");
  };

  const handleOpenDetail = (deviceId) => {
    navigate(`/devices/${deviceId}`);
  };

  const handleOpenMessages = (deviceId) => {
    navigate(`/messages?deviceId=${deviceId}`);
  };

  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredDevices = MOCK_DEVICES.filter((device) => {
    const inSelectedGroup =
      groupFilter === "all" || device.groupName.toLowerCase().replace(/\s+/g, "-") === groupFilter;

    const matchesSearch =
      !normalizedSearch ||
      device.name.toLowerCase().includes(normalizedSearch) ||
      device.serialNumber.toLowerCase().includes(normalizedSearch) ||
      device.groupName.toLowerCase().includes(normalizedSearch);

    return inSelectedGroup && matchesSearch;
  });

  const sortedDevices = [...filteredDevices].sort((first, second) => {
    if (sortBy === "name-asc") return first.name.localeCompare(second.name);
    if (sortBy === "name-desc") return second.name.localeCompare(first.name);
    if (sortBy === "last-seen-desc") {
      return new Date(second.lastSeenAt).getTime() - new Date(first.lastSeenAt).getTime();
    }
    return new Date(first.lastSeenAt).getTime() - new Date(second.lastSeenAt).getTime();
  });

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: "100%",
        p: { xs: 2, md: 3 },
        bgcolor: "grey.50",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <DevicesHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        groupFilter={groupFilter}
        onGroupFilterChange={setGroupFilter}
        onAddDevice={handleAddDevice}
      />

      <DeviceList
        devices={sortedDevices}
        onOpenDetail={handleOpenDetail}
        onOpenMessages={handleOpenMessages}
      />
    </Box>
  );
}