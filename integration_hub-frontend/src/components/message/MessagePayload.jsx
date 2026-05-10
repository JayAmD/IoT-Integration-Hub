import React from "react";
import { Paper, Typography, Box } from "@mui/material";

export default function MessagePayload({ data }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }} elevation={0}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Raw Payload (JSON)</Typography>
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'grey.900', 
          color: '#4af626', // Matrix green
          borderRadius: 2,
          fontFamily: '"Fira Code", "Roboto Mono", monospace',
          fontSize: '0.85rem',
          overflow: 'auto',
          maxHeight: 500,
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
        }}
      >
        <pre style={{ margin: 0 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </Box>
    </Paper>
  );
}
