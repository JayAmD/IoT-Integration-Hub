import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider
} from "@mui/material";

export default function MessageDetailModal({ open, onClose, message }) {
  if (!message) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Message Details
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
           <Typography variant="caption" color="text.secondary">
             MESSAGE ID
           </Typography>
           <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
             {message._id}
           </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Sensor Data (Payload)
        </Typography>
        
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'grey.900', 
            color: 'success.main', 
            borderRadius: 2,
            fontFamily: 'monospace',
            overflow: 'auto',
            maxHeight: 400
          }}
        >
          <pre style={{ margin: 0 }}>
            {JSON.stringify(message.data, null, 2)}
          </pre>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
