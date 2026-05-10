import { Stack, Typography, Pagination, Box } from "@mui/material";
import MessageListItem from "./MessageListItem.jsx";

export default function MessageList({
  messages,
  pagination,
  onPageChange,
  onViewDetail,
}) {
  if (!messages.length) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
        No messages found for this criteria.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5} sx={{ mt: 1 }}>
      {messages.map((message) => (
        <MessageListItem
          key={message._id}
          message={message}
          onViewDetail={onViewDetail}
        />
      ))}
      
      {pagination && pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Pagination 
            count={pagination.pages} 
            page={pagination.page} 
            onChange={(e, page) => onPageChange(page)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Stack>
  );
}
