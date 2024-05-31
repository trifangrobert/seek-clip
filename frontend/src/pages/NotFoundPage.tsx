import { Link as RouterLink } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";

const NotFoundPage = () => (
  <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, mt: 2 }}>
        We can't find the page you're looking for.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="/"
        sx={{ mt: 3, mb: 2 }}
      >
        Back to Home
      </Button>
    </Box>
  </Container>
);

export default NotFoundPage;
