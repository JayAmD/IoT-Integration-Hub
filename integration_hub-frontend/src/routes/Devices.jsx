import { Box, Icon, List, ListItem, Paper, Select, Typography } from '@mui/material';
import Button from '@mui/material/Button';

export default function ButtonUsage() {
  return (
    <Box>
      <Box>
        <Typography variant="h4">
          Devices
        </Typography>
        <Icon>  UP</Icon>
        <Select>

        </Select>
        <Select>

        </Select>
      </Box>
      <Box>
        <List>
          <ListItem>
            <Paper elevation={3} sx={{ padding: 2, display:'flex' }} >
              Hello world!
              </Paper>
          </ListItem>
        </List>
      </Box>

    </Box>
  )
}