import AddIcon from "@mui/icons-material/Add";
import { IconButton, InputAdornment, TextField } from "@mui/material";
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
  });
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [formErrors, setFormErrors] = useState<VideoFormErrors>({});

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateVideoForm(formValues);
    setFormErrors(validationErrors);
    // console.log(formValues);
    if (Object.keys(validationErrors).length === 0 && formValues.url) {
      // Form is valid, proceed with submission
      try {
        const data = await uploadVideo(formValues.title, formValues.url);
        // console.log("Video uploaded successfully");
        toast.success("Video uploaded successfully", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            });
          // redirect to home page
          navigate("/home", { replace: true });

      } catch (error) {
        // console.log("Error uploading video: ", error);
        toast.error("Error uploading video", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            });
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "#222831", color: "#ffffff" }}
          >
            Upload
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default VideoUploadForm;
