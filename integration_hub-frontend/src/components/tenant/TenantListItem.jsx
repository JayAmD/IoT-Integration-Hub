import React, { useState } from 'react';
import {
    Paper,
    Stack,
    Box,
    Typography,
    TextField,
    IconButton,
    Tooltip,
    Collapse,
    CircularProgress,
    Avatar,
    Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BusinessIcon from '@mui/icons-material/Business';
import { MembersList } from './MembersList';

export const TenantListItem = ({
    tenant,
    isActive,
    onSelect,
    onEdit,
    onDelete,
    onUpdateRole,
    onRemoveMember,
    onAddMember,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editName, setEditName] = useState(tenant.name);
    const [editDescription, setEditDescription] = useState(tenant.description || '');
    const [editError, setEditError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleEditClick = () => {
        setIsEditMode(true);
        setEditError('');
    };

    const handleEditCancel = () => {
        setIsEditMode(false);
        setEditName(tenant.name);
        setEditDescription(tenant.description || '');
        setEditError('');
    };

    const handleEditSave = async () => {
        if (!editName.trim()) {
            setEditError('Tenant name is required');
            return;
        }
        setIsSaving(true);
        try {
            await onEdit(tenant._id, {
                name: editName.trim(),
                description: editDescription.trim(),
            });
            setIsEditMode(false);
        } catch (err) {
            setEditError(err.message || 'Failed to update tenant');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = () => {
        if (window.confirm(`Delete tenant "${tenant.name}"? This action cannot be undone.`)) {
            onDelete(tenant._id);
        }
    };

    const handleKeyDown = (e) => {
        if (isEditMode) {
            if (e.key === 'Enter') { e.preventDefault(); handleEditSave(); }
            else if (e.key === 'Escape') { handleEditCancel(); }
        } else {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(tenant._id);
            }
        }
    };

    const handlePaperClick = () => {
        if (!isEditMode) {
            onSelect(tenant._id);
        }
    };

    return (
        <Paper
            elevation={0}
            role="button"
            tabIndex={0}
            onClick={handlePaperClick}
            onKeyDown={handleKeyDown}
            sx={{
                borderRadius: 3,
                border: '2px solid',
                borderColor: isActive ? 'primary.main' : 'divider',
                backgroundColor: isActive ? 'primary.50' : 'background.paper',
                boxShadow: isActive ? '0 0 12px rgba(25, 118, 210, 0.15)' : 'none',
                transition: 'all 0.2s ease',
                cursor: isEditMode ? 'default' : 'pointer',
                '&:hover': isEditMode ? {} : {
                    borderColor: 'primary.main',
                    boxShadow: isActive ? '0 0 16px rgba(25, 118, 210, 0.25)' : 2,
                    transform: 'translateY(-2px)',
                },
                "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: "2px",
                },
            }}
        >
            {/* Main row */}
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                    px: { xs: 1.5, md: 2.5 },
                    py: { xs: 1.5, md: 2 },
                    '&:hover .action-buttons': { opacity: 1 },
                }}
            >
                {/* Avatar */}
                <Avatar sx={{ bgcolor: isActive ? 'primary.main' : 'primary.100', width: 40, height: 40, flexShrink: 0 }}>
                    <BusinessIcon sx={{ color: isActive ? 'white' : 'primary.main' }} />
                </Avatar>

                {/* Expand toggle */}
                <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                    sx={{ color: 'primary.main', flexShrink: 0 }}
                >
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>

                {/* Name & description */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {isEditMode ? (
                        <Stack spacing={1}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Tenant Name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                error={!!editError}
                                helperText={editError}
                                disabled={isSaving}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                label="Description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                onKeyDown={handleKeyDown}
                                multiline
                                maxRows={2}
                                disabled={isSaving}
                            />
                        </Stack>
                    ) : (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="h6" sx={{ fontSize: { xs: '1.05rem', md: '1.2rem' }, fontWeight: isActive ? 700 : 500 }} noWrap>
                                    {tenant.name}
                                </Typography>
                                {tenant.description && (
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {tenant.description}
                                    </Typography>
                                )}
                            </Box>
                            {isActive && (
                                <Chip
                                    icon={<CheckCircleIcon sx={{ fontSize: '1rem !important', color: 'white !important' }} />}
                                    label="ACTIVE"
                                    size="small"
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.7rem',
                                        height: 24,
                                        '& .MuiChip-label': { px: 1 }
                                    }}
                                />
                            )}
                        </Stack>
                    )}
                </Box>

                {/* Member count */}
                {!isEditMode && (
                    <Box sx={{ minWidth: 80, textAlign: 'right', flexShrink: 0 }}>
                        <Typography variant="body2" color="text.secondary">Members</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {tenant.members?.length || 0}
                        </Typography>
                    </Box>
                )}

                {/* Action buttons */}
                {isEditMode ? (
                    <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                        <Tooltip title="Save (Enter)">
                            <span>
                                <IconButton
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); handleEditSave(); }}
                                    disabled={isSaving}
                                    sx={{ color: 'success.main' }}
                                >
                                    {isSaving ? <CircularProgress size={20} /> : <SaveIcon fontSize="small" />}
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Cancel (Esc)">
                            <IconButton
                                size="small"
                                onClick={(e) => { e.stopPropagation(); handleEditCancel(); }}
                                disabled={isSaving}
                            >
                                <CancelIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                ) : (
                    <Stack
                        direction="row"
                        spacing={0.5}
                        className="action-buttons"
                        sx={{ opacity: { xs: 1, md: 0 }, transition: 'opacity 0.2s ease', flexShrink: 0 }}
                    >
                        <Tooltip title="Edit tenant">
                            <IconButton
                                size="small"
                                onClick={(e) => { e.stopPropagation(); handleEditClick(); }}
                                sx={{ color: 'primary.main' }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete tenant">
                            <IconButton
                                size="small"
                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }}
                                sx={{ color: 'error.main' }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                )}
            </Stack>

            {/* Expanded members section — always available */}
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ px: { xs: 1.5, md: 2.5 }, pb: 2, backgroundColor: 'action.hover' }}>
                    <MembersList
                        tenant={tenant}
                        tenantId={tenant._id}
                        onUpdateRole={onUpdateRole}
                        onRemoveMember={onRemoveMember}
                        onAddMember={onAddMember}
                    />
                </Box>
            </Collapse>
        </Paper>
    );
};
