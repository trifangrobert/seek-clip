import React, { useEffect, useState } from "react";
import {
  EditUserProfile,
  EditUserProfileErrors,
  UserProfile,
} from "../models/UserType";
import { getUserByUsername } from "../services/UserService";
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import DefaultProfilePicture from "../assets/default-profile-picture.png";
import { useAuthContext } from "../context/AuthContext";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const ProfilePage = () => {
  const { user, token, updateProfile } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<EditUserProfile>({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    profilePicture: null,
  });
  const [formErrors, setFormErrors] = useState<EditUserProfileErrors>({});

  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    DefaultProfilePicture
  );
  useEffect(() => {
    console.log("user: ", user);
    if (user) {
      console.log("user: ", user.profilePicture);
      setProfilePicture(
        process.env.REACT_APP_API_URL + "/" + user.profilePicture
      );

      setFormData({
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: null,
      });

      setLoading(false);
    }
  }, [user]);

  // console.log(profilePicture);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProfilePicture(reader.result);
          setFormData((prev) => ({ ...prev, profilePicture: file }));
        } else {
          setProfilePicture(undefined);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Call API to update user profile: updateUserProfile
    try {
      // Update user profile using updateUserProfile from useAuthContext
      updateProfile(
        formData.email,
        formData.username,
        formData.firstName,
        formData.lastName,
        formData.profilePicture!
      );

      // update only the modified fields in local storage
      // const user = localStorage.getItem("user");
      // const userObj = user ? JSON.parse(user) : null;
      // if (userObj) {
      //   userObj.email = email;
      //   userObj.username = username;
      //   userObj.firstName = firstName;
      //   userObj.lastName = lastName;
      //   localStorage.setItem("user", JSON.stringify(userObj));
      // }
    } catch (error) {
      console.error("Error updating user profile: ", error);
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    if (user) {
      setFormData({
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: null,
      });
    }
  }

  if (!user || loading)
    return (
      <Typography variant="h6" sx={{ p: 2 }}>
        Loading user data...
      </Typography>
    );

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", my: 4, marginTop: 10 }}>
      <Box sx={{ mx: "auto", display: "flex", justifyContent: "center" }}>
        {editMode ? (
          <>
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
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    sx={{
                      backgroundColor: "white",
                      "&:hover": { backgroundColor: "#e0e0e0" },
                    }}
                  >
                    <AddAPhotoIcon />
                  </IconButton>
                }
              >
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={profilePicture}
                  alt={formData.username}
                />
              </Badge>
            </label>
          </>
        ) : (
          <Avatar
            sx={{ width: 100, height: 100 }}
            src={profilePicture}
            alt={formData.username}
          />
        )}
      </Box>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={!!formErrors.username}
        helperText={formErrors.username}
        disabled={true}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        name="email"
        value={formData.email}
        onChange={handleChange}
        disabled={!editMode}
        error={!!formErrors.email}
        helperText={formErrors.email}
      />
      <TextField
        label="First Name"
        variant="outlined"
        fullWidth
        margin="normal"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        disabled={!editMode}
        error={!!formErrors.firstName}
        helperText={formErrors.firstName}
      />
      <TextField
        label="Last Name"
        variant="outlined"
        fullWidth
        margin="normal"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        disabled={!editMode}
        error={!!formErrors.lastName}
        helperText={formErrors.lastName}
      />
      {editMode ? (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: "primary.main",
              ":hover": { bgcolor: "primary.dark" },
              px: 3,
              py: 1,
              borderRadius: 2,
            }}
          >
            Save Changes
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => handleCancel()}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
        </Box>
      ) : (
        <Button
          color="primary"
          variant="contained"
          onClick={() => setEditMode(true)}
          sx={{
            mt: 2,
            bgcolor: "primary.main",
            ":hover": {
              bgcolor: "primary.dark",
            },
            px: 3,
            py: 1,
            borderRadius: 2,
            display: "block",
            margin: "auto",
          }}
        >
          Edit Profile
        </Button>
      )}
    </Box>
  );
};

export default ProfilePage;
