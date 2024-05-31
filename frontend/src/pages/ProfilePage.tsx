import React, { useEffect, useState } from "react";
import {
  EditUserProfile,
  EditUserProfileErrors,
  UserProfile,
} from "../models/UserType";
import { checkFollowing, getUserByUsername } from "../services/UserService";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import DefaultProfilePicture from "../assets/default-profile-picture.png";
import { useAuthContext } from "../context/AuthContext";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import VideoGrid from "../components/VideoGrid";
import { validateEditProfileForm } from "../utils/Validation";
import { useVideosByUser } from "../hooks/useVideosByUser";

const ProfilePage = () => {
  const navigate = useNavigate();

  const { username: urlUsername } = useParams<{ username: string }>();
  const { user, token, updateProfile } = useAuthContext();
  const [userProfileInfo, setUserProfileInfo] = useState<UserProfile | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    DefaultProfilePicture
  );
  const [formData, setFormData] = useState<EditUserProfile>({
    firstName: "",
    lastName: "",
    profilePicture: null,
  });
  const [formErrors, setFormErrors] = useState<EditUserProfileErrors>({});

  const [following, setFollowing] = useState<boolean>(false);

  const { videos: userVideos, loading: videosLoading } = useVideosByUser(
    userProfileInfo?._id!
  );

  useEffect(() => {
    if (!userProfileInfo) {
      return;
    }
    const fetchFollowing = async () => {
      try {
        const response = await checkFollowing(userProfileInfo._id);
        setFollowing(response);
        console.log("Following: ", response);
      } catch (error) {
        console.error("Error checking if user is following: ", error);
      }
    };

    fetchFollowing();
  }, [userProfileInfo]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError("");
      try {
        if (!urlUsername) {
          throw new Error("Username not specified in the URL");
        }
        const user = await getUserByUsername(urlUsername);
        if (user) {
          setProfilePicture(
            user.profilePicture
              ? `${process.env.REACT_APP_API_URL}/${user.profilePicture}`
              : DefaultProfilePicture
          );
          setUserProfileInfo(user);
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: null,
          });
        } else {
          throw new Error("User not found");
        }
      } catch (error: any) {
        console.error("Error fetching user data: ", error);
        setError(error.message || "Failed to fetch user data");
        toast.error("User not found");
        navigate(`/profile/${user?.username}`, { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [urlUsername, navigate, user]);

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
    const validationErrors = validateEditProfileForm(formData);
    setFormErrors(validationErrors);
    console.log(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      await updateProfile(
        user!.username,
        formData.firstName,
        formData.lastName,
        formData.profilePicture!
      );
      setEditMode(false);
      // toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile: ", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    if (userProfileInfo) {
      setFormData({
        firstName: userProfileInfo.firstName,
        lastName: userProfileInfo.lastName,
        profilePicture: null,
      });
      setProfilePicture(
        userProfileInfo.profilePicture
          ? `${process.env.REACT_APP_API_URL}/${userProfileInfo.profilePicture}`
          : DefaultProfilePicture
      );
    }
  };

  const isOwner = user?.username === urlUsername;

  if (loading) {
    return <Typography>Loading user data...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!userProfileInfo) {
    return <Typography>User not found</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", my: 4, mt: 10 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              isOwner &&
              editMode && (
                <>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="icon-button-file"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <AddAPhotoIcon />
                    </IconButton>
                  </label>
                </>
              )
            }
          >
            <Avatar
              sx={{ width: 150, height: 150 }}
              src={profilePicture}
              alt={userProfileInfo.username}
            />
          </Badge>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {editMode ? (
                <>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="firstName"
                    value={formData.firstName}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                  />
                </>
              ) : (
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h5" component="h1">
                    {userProfileInfo.username}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {userProfileInfo.firstName} {userProfileInfo.lastName}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item sx={{ pr: 5 }}>
              {isOwner &&
                (editMode ? (
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginRight: 1 }}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                ))}
              {!isOwner && (
                <>
                  {following ? (
                    <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                      Unfollow
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                      Follow
                    </Button>
                  )}
                  <Button variant="outlined" color="primary">
                    Chat
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            sx={{
              ml: -3,
              marginTop: 1,
              textAlign: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid item xs={4}>
              <Typography>10 posts</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>1000 followers</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>1000 following</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Videos by {userProfileInfo.username}
      </Typography>
      <Grid container spacing={2}>
        <VideoGrid videos={userVideos} loading={videosLoading} />
      </Grid>
    </Box>
  );
};

export default ProfilePage;
