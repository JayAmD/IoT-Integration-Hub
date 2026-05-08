import { Stack, Typography } from "@mui/material";
import GroupListItem from "./GroupListItem.jsx";

export default function GroupList({
    groups,
    isEditing,
    editingGroupId,
    editValue,
    onEditChange,
    onEditSave,
    onEditCancel,
    onDelete,
    onEdit,
}) {
    if (!groups.length) {
        return (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                No groups found.
            </Typography>
        );
    }

    return (
        <Stack spacing={1.5} sx={{ mt: 2 }}>
            {groups.map((group) => (
                <GroupListItem
                    key={group._id}
                    group={group}
                    isEditing={isEditing && editingGroupId === group._id}
                    editValue={editValue}
                    onEditChange={onEditChange}
                    onEditSave={() => onEditSave(group._id)}
                    onEditCancel={onEditCancel}
                    onDelete={() => onDelete(group._id)}
                    onEdit={() => onEdit(group)}
                />
            ))}
        </Stack>
    );
}
