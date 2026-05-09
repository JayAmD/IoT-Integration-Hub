import { 
    Paper, 
    Stack, 
    Typography, 
    IconButton, 
    Chip, 
    Switch, 
    Box, 
    Tooltip,
    useTheme
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";

export default function EndpointListItem({ 
    endpoint, 
    onEdit, 
    onDelete, 
    onToggleActive 
}) {
    const theme = useTheme();

    const getMethodColor = (method) => {
        switch (method) {
            case 'POST': return theme.palette.success.main;
            case 'PUT': return theme.palette.info.main;
            case 'PATCH': return theme.palette.warning.main;
            default: return theme.palette.grey[500];
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: endpoint.isActive ? "divider" : "grey.200",
                backgroundColor: "background.paper",
                opacity: endpoint.isActive ? 1 : 0.8,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                }
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                {/* Status Toggle */}
                <Tooltip title={endpoint.isActive ? "Deactivate" : "Activate"}>
                    <Switch
                        size="small"
                        checked={endpoint.isActive}
                        onChange={() => onToggleActive(endpoint)}
                        color="primary"
                    />
                </Tooltip>

                {/* Identity & URL */}
                <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {endpoint.name}
                        </Typography>
                        <Chip 
                            label={endpoint.method} 
                            size="small" 
                            sx={{ 
                                fontWeight: 800, 
                                fontSize: '0.7rem',
                                bgcolor: getMethodColor(endpoint.method),
                                color: 'white'
                            }} 
                        />
                    </Stack>
                    
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                        <LinkIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '400px' }}>
                            {endpoint.url}
                        </Typography>
                    </Stack>
                </Box>

                {/* Groups */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexWrap: 'wrap', gap: 0.5, maxWidth: '250px', justifyContent: 'flex-end' }}>
                    {endpoint.groupIds && endpoint.groupIds.length > 0 ? (
                        endpoint.groupIds.map((group) => (
                            <Chip 
                                key={group._id} 
                                label={group.name} 
                                size="small" 
                                variant="outlined" 
                                sx={{ height: '20px', fontSize: '0.7rem' }} 
                            />
                        ))
                    ) : (
                        <Typography variant="caption" color="text.disabled">No Groups</Typography>
                    )}
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={0.5}>
                    <IconButton 
                        size="small" 
                        onClick={() => onEdit(endpoint)}
                        sx={{ color: theme.palette.grey[600], "&:hover": { color: theme.palette.primary.main } }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        onClick={() => onDelete(endpoint._id)}
                        sx={{ color: theme.palette.grey[600], "&:hover": { color: theme.palette.error.main } }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Stack>
        </Paper>
    );
}
