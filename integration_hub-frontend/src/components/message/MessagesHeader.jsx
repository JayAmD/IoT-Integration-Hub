import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
    IconButton,
    Tooltip
} from "@mui/material";

export default function MessagesHeader(props) {
    const {
        searchValue,
        onSearchChange,
        statusFilter,
        onStatusFilterChange,
        onRefresh
    } = props;

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, md: 2.5 },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                mb: 3
            }}
        >
            <Stack spacing={2}>
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
                        Messages
                    </Typography>

                    <Tooltip title="Refresh Messages">
                        <IconButton onClick={onRefresh} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Stack direction={{ xs: "column", lg: "row" }} spacing={1.5}>
                    <TextField
                        size="small"
                        placeholder="Search by serial number"
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.target.value)}
                        sx={{ width: "100%", maxWidth: { lg: 340 }, borderRadius: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 190 } }}>
                        <InputLabel id="message-status-filter-label">Filter Status</InputLabel>
                        <Select
                            labelId="message-status-filter-label"
                            value={statusFilter}
                            label="Filter Status"
                            onChange={(event) => onStatusFilterChange(event.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="failed">Failed</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Stack>
        </Paper>
    );
}
