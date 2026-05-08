import React from 'react';
import { Stack, Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MemberListItem } from './MemberListItem';

export const MembersList = ({
    tenant,
    tenantId,
    onUpdateRole,
    onRemoveMember,
    onAddMember,
}) => {
    return (
        <Stack spacing={1.5} sx={{ mt: 2, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Members ({tenant.members?.length || 0})
                </Typography>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => onAddMember(tenant)}
                >
                    Add Member
                </Button>
            </Box>

            {tenant.members && tenant.members.length > 0 ? (
                <Stack spacing={1}>
                    {tenant.members.map((member) => (
                        <MemberListItem
                            key={member.userId._id}
                            member={member}
                            tenantId={tenantId}
                            onUpdateRole={onUpdateRole}
                            onRemoveMember={onRemoveMember}
                        />
                    ))}
                </Stack>
            ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                    No members yet
                </Typography>
            )}
        </Stack>
    );
};
