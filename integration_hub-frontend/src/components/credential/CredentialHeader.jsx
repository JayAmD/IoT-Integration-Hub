import AddIcon from "@mui/icons-material/Add";
import {
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

export default function CredentialHeader({ onAddCredential }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: {xs: 2, md: 2.5},
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                mb: 3
            }}
        >
            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                <Typography variant="h4" sx={{fontWeight: 700, letterSpacing: 0.2}}>
                    Credentials
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon/>}
                    onClick={onAddCredential}
                    sx={{borderRadius: 2, px: 2.25, textTransform: "none", fontWeight: 600}}
                >
                    Add Credential
                </Button>
            </Stack>
        </Paper>
    );
}
