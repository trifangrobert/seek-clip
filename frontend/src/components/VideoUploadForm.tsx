import AddIcon from "@mui/icons-material/Add";
import {
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box, Button, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import { VideoFormErrors, VideoFormValues } from "../models/VideoFormType";
import { validateVideoForm } from "../utils/Validation";
import { uploadVideo } from "../services/VideoService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VideoUploadForm = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<VideoFormValues>({
    url: null,
    title: "",
    description: "",
    hashtags: [],
  });
  const [newHashtag, setNewHashtag] = useState<string>("#");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [formErrors, setFormErrors] = useState<VideoFormErrors>({});
  const [uploading, setUploading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    if (name === "url" && files) {
      const file = files[0];
      setSelectedFileName(file.name);
      setFormValues((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleHashtagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setNewHashtag("#");
    } else if (!value.startsWith("#")) {
      setNewHashtag("#" + value);
    } else {
      setNewHashtag(value);
    }
  };

  const handleAddHashtag = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && newHashtag.trim() !== "#") {
      event.preventDefault();
      const formattedHashtag = newHashtag.trim().substring(1); 
      if (!formValues.hashtags.includes(formattedHashtag)) {
        setFormValues((prev) => ({
          ...prev,
          hashtags: [...prev.hashtags, formattedHashtag],
        }));
        setNewHashtag("#");
      }
    }
  };

  const handleDeleteHashtag = (tagToDelete: string) => {
    setFormValues((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateVideoForm(formValues);
    setFormErrors(validationErrors);
    // console.log(formValues);
    if (Object.keys(validationErrors).length === 0 && formValues.url) {
      setUploading(true);
      // Form is valid, proceed with submission
      try {
        const data = await uploadVideo(
          formValues.title,
          formValues.description,
          formValues.hashtags,
          formValues.url
        );
        // console.log("Video uploaded successfully");
        toast.success("Video uploaded successfully", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
        });
        // redirect to home page
        navigate("/home", { replace: true });
        setUploading(false);
      } catch (error) {
        // console.log("Error uploading video: ", error);
        toast.error("Error uploading video", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
        });
        setUploading(false);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 25,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Upload Video
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoComplete="title"
            value={formValues.title}
            onChange={handleChange}
            error={!!formErrors.title}
            helperText={formErrors.title}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="description"
            label="Description"
            type="description"
            id="description"
            autoComplete="description"
            value={formValues.description}
            onChange={handleChange}
            error={!!formErrors.description}
            helperText={formErrors.description}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="video"
            label="Video File"
            value={selectedFileName}
            error={!!formErrors.url}
            helperText={formErrors.url}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    color="primary"
                    aria-label="upload video"
                    component="label"
                  >
                    <input
                      type="file"
                      hidden
                      name="url"
                      accept="video/*"
                      onChange={handleChange}
                    />
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="new-hashtag"
            label="Add Hashtags (press Enter to add)"
            value={newHashtag}
            onChange={handleHashtagChange}
            onKeyDown={handleAddHashtag}
            helperText="Type a hashtag and press Enter"
            variant="outlined"
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
            {formValues.hashtags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                onDelete={() => handleDeleteHashtag(tag)}
                color="primary"
              />
            ))}
          </Box>
          {uploading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress color="primary" size={24} />
            </Box>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "#222831", color: "#ffffff" }}
            >
              Upload
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default VideoUploadForm;
