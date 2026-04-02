import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

export default function DevicesHeader(props) {
    const {
        searchValue,
        onSearchChange,
        sortBy,
        onSortByChange,
        groupFilter,
        onGroupFilterChange,
        onAddDevice,
    } = props

    return (
        <Paper
            elevation={0}
            sx={{
                p: {xs: 2, md: 2.5},
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
            }}
        >
            <Stack spacing={2}>
                <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Typography variant="h4" sx={{fontWeight: 700, letterSpacing: 0.2}}>
                        Devices
                    </Typography>

                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon/>}
                        onClick={onAddDevice}
                        sx={{borderRadius: 2, px: 2.25, textTransform: "none", fontWeight: 600}}
                    >
                        Add Device
                    </Button>
                </Stack>

                <Stack direction={{xs: "column", lg: "row"}} spacing={1.5}>
                    <TextField
                        size="small"
                        placeholder="Search devices"
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.target.value)}
                        sx={{width: "100%", maxWidth: {lg: 340}, ml: {lg: "auto"}, borderRadius: 2}}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="action"/>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                    />

                    <FormControl size="small" sx={{minWidth: {xs: "100%", sm: 190}}}>
                        <InputLabel id="device-sort-label">Sort by</InputLabel>
                        <Select
                            labelId="device-sort-label"
                            value={sortBy}
                            label="Sort by"
                            onChange={(event) => onSortByChange(event.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                            <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                            <MenuItem value="last-seen-desc">Last seen (newest)</MenuItem>
                            <MenuItem value="last-seen-asc">Last seen (oldest)</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{minWidth: {xs: "100%", sm: 190}}}>
                        <InputLabel id="device-group-filter-label">Filter group</InputLabel>
                        <Select
                            labelId="device-group-filter-label"
                            value={groupFilter}
                            label="Filter group"
                            onChange={(event) => onGroupFilterChange(event.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="all">All groups</MenuItem>
                            <MenuItem value="forest-nodes">Forest nodes</MenuItem>
                            <MenuItem value="preemptive-maintenance">Preemptive maintenance</MenuItem>
                            <MenuItem value="greenhouse">Greenhouse</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Stack>
        </Paper>
    );
}