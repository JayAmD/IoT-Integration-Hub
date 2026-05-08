import React from 'react';
import { Stack, Typography } from '@mui/material';
import { TenantListItem } from './TenantListItem';

export const TenantList = ({
    tenants,
    activeTenantId,
    onSelect,
    onEdit,
    onDelete,
    onUpdateRole,
    onRemoveMember,
    onAddMember,
}) => {
    if (!tenants.length) {
        return (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                No tenants found. Create one to get started!
            </Typography>
        );
    }

    return (
        <Stack spacing={1.5} sx={{ mt: 2 }}>
            {tenants.map((tenant) => (
                <TenantListItem
                    key={tenant._id}
                    tenant={tenant}
                    isActive={tenant._id === activeTenantId}
                    onSelect={onSelect}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onUpdateRole={onUpdateRole}
                    onRemoveMember={onRemoveMember}
                    onAddMember={onAddMember}
                />
            ))}
        </Stack>
    );
};
