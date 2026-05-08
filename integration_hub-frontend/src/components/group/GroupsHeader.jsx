import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
    Button,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

export default function GroupsHeader(props) {
    const {
        searchValue,
        onSearchChange,
        onAddGroup,
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
            }}
        >
            <Stack spacing={2}>
                <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
                        Groups
                    </Typography>

                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon />}
                        onClick={onAddGroup}
                        sx={{ borderRadius: 2, px: 2.25, textTransform: "none", fontWeight: 600 }}
                    >
                        Add Group
                    </Button>
                </Stack>

                <Stack direction={{ xs: "column", lg: "row" }} spacing={1.5}>
                    <TextField
                        size="small"
                        placeholder="Search groups"
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.target.value)}
                        sx={{ width: "100%", maxWidth: { lg: 340 }, ml: { lg: "auto" }, borderRadius: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                    />
                </Stack>
            </Stack>
        </Paper>
    );
}
