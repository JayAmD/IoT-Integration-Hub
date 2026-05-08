import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import {
    Box,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

export default function GroupListItem({
    group,
    isEditing,
    editValue,
    onEditChange,
    onEditSave,
    onEditCancel,
    onDelete,
    onEdit,
}) {
    const groupId = group._id;
    const createdDate = group.createdAt ? new Date(group.createdAt).toLocaleDateString() : 'N/A';

    const handleEditClick = () => {
        onEdit();
    };

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "primary.50",
                px: { xs: 1.5, md: 2.5 },
                py: { xs: 1.5, md: 2 },
                transition: "all 0.2s ease",
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {isEditing ? (
                        <TextField
                            size="small"
                            value={editValue}
                            onChange={(e) => onEditChange(e.target.value)}
                            placeholder="Group name"
                            sx={{
                                width: "100%",
                                maxWidth: 300,
                            }}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onEditSave();
                                } else if (e.key === 'Escape') {
                                    onEditCancel();
                                }
                            }}
                        />
                    ) : (
                        <>
                            <Typography variant="h6" sx={{ fontSize: { xs: "1.05rem", md: "1.2rem" } }} noWrap>
                                {group.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                Created: {createdDate}
                            </Typography>
                        </>
                    )}
                </Box>

                <Stack direction="row" spacing={0.5}>
                    {isEditing ? (
                        <>
                            <IconButton
                                size="small"
                                onClick={onEditSave}
                                sx={{
                                    color: "success.main",
                                    "&:hover": { bgcolor: "success.light" },
                                }}
                                title="Save"
                            >
                                <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={onEditCancel}
                                sx={{
                                    color: "warning.main",
                                    "&:hover": { bgcolor: "warning.light" },
                                }}
                                title="Cancel"
                            >
                                <CancelIcon fontSize="small" />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton
                                size="small"
                                onClick={handleEditClick}
                                sx={{
                                    color: "primary.main",
                                    "&:hover": { bgcolor: "primary.light" },
                                }}
                                title="Edit"
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={onDelete}
                                sx={{
                                    color: "error.main",
                                    "&:hover": { bgcolor: "error.light" },
                                }}
                                title="Delete"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </>
                    )}
                </Stack>
            </Stack>
        </Paper>
    );
}
