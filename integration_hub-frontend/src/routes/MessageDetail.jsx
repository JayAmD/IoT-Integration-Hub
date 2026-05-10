import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useAuthContext } from "../context/AuthContext.jsx";
import { useMessageContext } from "../context/MessageContext.jsx";

// Sub-components
import MessageDetailHeader from "../components/message/MessageDetailHeader.jsx";
import MessageOverview from "../components/message/MessageOverview.jsx";
import MessageDispatchLog from "../components/message/MessageDispatchLog.jsx";
import MessagePayload from "../components/message/MessagePayload.jsx";

export default function MessageDetail() {
  const { tenantId, messageId } = useParams();
  const navigate = useNavigate();
  const { activeTenantId } = useAuthContext();
  const { fetchMessageById, isLoading, error } = useMessageContext();
  
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadMessage = async () => {
      const data = await fetchMessageById(messageId);
      if (data) {
        setMessage(data);
      }
    };
    loadMessage();
  }, [messageId, fetchMessageById]);

  const handleBack = () => {
    navigate(`/tenants/${activeTenantId}/messages`);
  };

  const handleRefresh = async () => {
    const data = await fetchMessageById(messageId);
    if (data) {
      setMessage(data);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'grey.50' }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (!message && !isLoading) {
    return (
      <Box sx={{ p: 4, bgcolor: 'grey.50', minHeight: 'calc(100vh - 64px)' }}>
        <Typography color="error" variant="h6">
          {error || "Message not found."}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }} variant="outlined">
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box 
      component="main" 
      sx={{ 
        flexGrow: 1, 
        width: "100%", 
        p: { xs: 2, md: 4 }, 
        bgcolor: "grey.50", 
        minHeight: "calc(100vh - 64px)" 
      }}
    >
      <MessageDetailHeader 
        onBack={handleBack} 
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <Stack spacing={3}>
        <MessageOverview message={message} tenantId={activeTenantId} />
        
        <MessageDispatchLog dispatches={message.dispatches} tenantId={activeTenantId} />
        
        <MessagePayload data={message.data} />
      </Stack>
    </Box>
  );
}
