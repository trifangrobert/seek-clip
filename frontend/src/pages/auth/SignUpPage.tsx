import {
  Avatar,
  Container,
  CssBaseline,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Link,
  Badge,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import React, { useEffect, useState } from "react";
import { validateRegisterForm } from "../../utils/Validation";
import {
  RegisterFormValues,
  RegisterFormErrors,
} from "../../models/AuthFormType";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DefaultProfilePicture from "../../assets/default-profile-picture.png";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { registerUser, user } = useAuthContext();
  const [formValues, setFormValues] = useState<RegisterFormValues>({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    profilePicture: null,
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  // initialize profilePicPreview statewith default profile picture
  const [profilePicPreview, setProfilePicPreview] = useState<
    string | undefined
  >(DefaultProfilePicture);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // check if user is already logged in with useEffect
  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file: ", file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProfilePicPreview(reader.result);
          setFormValues((prev) => ({ ...prev, profilePicture: file }));
        } else {
          console.log("Error reading image file");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateRegisterForm(formValues);
    setErrors(validationErrors);
    console.log(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, proceed with submission
      console.log("Form submission", formValues);
      registerUser(
        formValues.email,
        formValues.username,
        formValues.password,
        formValues.firstName,
        formValues.lastName,
        formValues.profilePicture!
      );
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="raised-button-file">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <IconButton
                  aria-label="upload picture"
                  component="span"
                  sx={{
                    color: "#6200ee",
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#e0e0e0" },
                    width: 30,
                    height: 30, 
                    minHeight: 0, 
                    minWidth: 0, 
                  }}
                >
                  <AddAPhotoIcon fontSize="small" />
                </IconButton>
              }
            >
              <Avatar
                sx={{ m: 1, bgcolor: "primary.main", width: 100, height: 100 }}
                src={profilePicPreview}
              >
                <LockOutlinedIcon />
              </Avatar>
            </Badge>
          </label>
          <Typography component="h1" variant="h4" sx={{ m: 2 }}>
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="firstName"
                  autoFocus
                  value={formValues.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
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
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={formValues.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
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
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body1">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
