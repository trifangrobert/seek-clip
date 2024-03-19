import {
  Avatar,
  Container,
  CssBaseline,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import React, { useState } from 'react';
import  { validateForm } from "../../utils/validation";
import { FormValues, FormErrors } from "../../types/validationTypes";

export default function SignUp() {
  const [formValues, setFormValues] = useState<FormValues>({email: '', password: ''});
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value} = event.target;
    setFormValues(prev => ({...prev, [name]: value }));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(formValues);
    setErrors(validationErrors);
    console.log(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, proceed with submission
      console.log("Form submission", formValues);
    }

  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 25,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ m: 2 }}>
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formValues.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formValues.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
            </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
