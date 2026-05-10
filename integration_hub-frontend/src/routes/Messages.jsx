import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Alert } from "@mui/material";

import { useMessageContext } from "../context/MessageContext.jsx";
import MessagesHeader from "../components/message/MessagesHeader.jsx";
import MessageList from "../components/message/MessageList.jsx";
import MessageDetailModal from "../components/message/MessageDetailModal.jsx";

export default function Messages() {
  const navigate = useNavigate();
  const { tenantId } = useParams();
  const [searchParams] = useSearchParams();
  const initialDeviceId = searchParams.get("deviceId") || "";
  
  const { 
    messages, 
    pagination, 
    isLoading, 
    error, 
    filters, 
    updateFilters, 
    fetchMessages 
  } = useMessageContext();

  // --- HANDLERS ---

  const handleRefresh = async () => {
    await fetchMessages();
  };

  const handleSearchChange = (val) => {
    updateFilters({ deviceId: val });
  };

  const handleStatusFilterChange = (val) => {
    updateFilters({ status: val === 'all' ? '' : val });
  };

  const handlePageChange = (page) => {
    updateFilters({ page });
  };

  const handleViewDetail = (id) => {
    navigate(`/tenants/${tenantId}/messages/${id}`);
  };

  // --- EFFECTS ---

  // Sync deviceId from URL into filters on mount
  useEffect(() => {
    if (initialDeviceId) {
      updateFilters({ deviceId: initialDeviceId });
    }
  }, [initialDeviceId]);

  // Fetch messages whenever filters change
  useEffect(() => {
    fetchMessages();
  }, [filters, fetchMessages]);

  return (
    <Box 
      component="main" 
      sx={{ 
        flexGrow: 1, 
        width: "100%", 
        p: { xs: 2, md: 3 }, 
        bgcolor: "grey.50", 
        minHeight: "calc(100vh - 64px)" 
      }}
    >
      <MessagesHeader 
        searchValue={filters.deviceId}
        onSearchChange={handleSearchChange}
        statusFilter={filters.status || 'all'}
        onStatusFilterChange={handleStatusFilterChange}
        onRefresh={handleRefresh}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading && !messages.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MessageList 
          messages={messages}
          pagination={pagination}
          onPageChange={handlePageChange}
          onViewDetail={handleViewDetail}
        />
      )}
    </Box>
  );
}
