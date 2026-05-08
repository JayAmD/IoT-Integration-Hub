import { useState, useEffect } from "react";
import { Box, Snackbar, Alert, Typography } from "@mui/material";
import GroupsHeader from "../components/group/GroupsHeader.jsx";
import GroupList from "../components/group/GroupList.jsx";
import AddGroupModal from "../components/group/AddGroupModal.jsx";
import { useGroupsContext } from "../context/GroupContext.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";

export default function Groups() {
    const { groups, loadGroups, addGroup, updateGroup, deleteGroup } = useGroupsContext();
    const { token } = useAuthContext();

    // State
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [editingGroupId, setEditingGroupId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [error, setError] = useState("");

    // Modals & Notifications
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Load groups on mount
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                await loadGroups();
                setError("");
            } catch (err) {
                setError(err.message || "Failed to load groups");
            }
        };

        fetchGroups();
    }, [token]);

    // Filter groups based on search
    useEffect(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();
        const filtered = groups.filter((group) =>
            !normalizedSearch || group.name.toLowerCase().includes(normalizedSearch)
        );
        setFilteredGroups(filtered);
    }, [groups, searchValue]);

    const showSnackbar = (message, severity = "success") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleAddGroupClick = () => {
        setIsAddModalOpen(true);
    };

    const handleAddGroup = async (groupData) => {
        try {
            await addGroup(groupData.name);
            showSnackbar("Group created successfully!");
        } catch (err) {
            showSnackbar(err.message || "Failed to create group", "error");
        }
    };

    const handleEditClick = (group) => {
        setEditingGroupId(group._id);
        setEditValue(group.name);
    };

    const handleEditChange = (value) => {
        setEditValue(value);
    };

    const handleEditSave = async (groupId) => {
        if (!editValue.trim()) {
            showSnackbar("Group name cannot be empty", "error");
            return;
        }

        if (editValue.trim().length > 255) {
            showSnackbar("Group name cannot exceed 255 characters", "error");
            return;
        }

        try {
            await updateGroup(groupId, { name: editValue.trim() });
            setEditingGroupId(null);
            setEditValue("");
            showSnackbar("Group updated successfully!");
        } catch (err) {
            showSnackbar(err.message || "Failed to update group", "error");
        }
    };

    const handleEditCancel = () => {
        setEditingGroupId(null);
        setEditValue("");
    };

    const handleDeleteGroup = async (groupId) => {
        const groupToDelete = groups.find((g) => g._id === groupId);
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the group "${groupToDelete?.name}"? This action cannot be undone.`
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteGroup(groupId);
            showSnackbar("Group deleted successfully!");
        } catch (err) {
            showSnackbar(err.message || "Failed to delete group", "error");
        }
    };

    const handleModalClose = () => {
        setIsAddModalOpen(false);
    };

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
            <GroupsHeader
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onAddGroup={handleAddGroupClick}
            />

            {error && (
                <Typography color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
                    Error: {error}
                </Typography>
            )}

            <GroupList
                groups={filteredGroups}
                isEditing={editingGroupId !== null}
                editingGroupId={editingGroupId}
                editValue={editValue}
                onEditChange={handleEditChange}
                onEditSave={handleEditSave}
                onEditCancel={handleEditCancel}
                onDelete={handleDeleteGroup}
                onEdit={handleEditClick}
            />

            <AddGroupModal
                open={isAddModalOpen}
                onClose={handleModalClose}
                onAddGroup={handleAddGroup}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: "100%", borderRadius: 2 }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
