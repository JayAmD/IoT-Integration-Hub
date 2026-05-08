import React from 'react';
import {
    Stack,
    Typography,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const MemberListItem = ({
    member,
    tenantId,
    onUpdateRole,
    onRemoveMember,
}) => {
    const handleRoleChange = async (newRole) => {
        await onUpdateRole(tenantId, member.userId._id, newRole);
    };

    const handleRemove = async () => {
        if (window.confirm(`Remove ${member.userId.email} from this tenant?`)) {
            await onRemoveMember(tenantId, member.userId._id);
        }
    };

    return (
        <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
                p: 1.5,
                backgroundColor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { backgroundColor: 'action.hover' },
                transition: 'background-color 0.2s ease',
            }}
        >
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap>
                    {member.userId.email}
                </Typography>
            </Box>

            <Select
                value={member.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                size="small"
                sx={{ minWidth: 110 }}
            >
                <MenuItem value="owner">Owner</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
            </Select>

            <Tooltip title="Remove member">
                <IconButton
                    size="small"
                    onClick={handleRemove}
                    sx={{ color: 'error.main' }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Stack>
    );
};
