import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  EditVideoFormValues,
  EditVideoFormErrors,
} from "../models/VideoFormType";
import { validateEditVideoForm } from "../utils/Validation";
import {
  deleteVideo,
  getVideoById,
  updateVideo,
} from "../services/VideoService";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";

const EditVideoPage = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<EditVideoFormValues>({
    title: "",
    description: "",
    hashtags: [],
  });
  const [formErrors, setFormErrors] = useState<EditVideoFormErrors>({});
  const [editing, setEditing] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();

  const [newHashtag, setNewHashtag] = useState("#");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        if (!id) {
          return;
        }
        const video = await getVideoById(id);
        setFormValues({
          title: video.title,
          description: video.description,
          hashtags: video.hashtags ?? [],
        });
      } catch (error) {
        toast.error("Error fetching video", {
          position: "bottom-center",
          autoClose: 2000,
        });
      }
    };
    fetchVideo();
  }, [id]);

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
      const formattedHashtag = newHashtag.trim().substring(1); // Remove the `#`
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateEditVideoForm(formValues);
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setEditing(true);
      try {
        // Call API to update video
        console.log("Form is valid, proceed with submission");
        const data = await updateVideo(
          formValues.title,
          formValues.description,
          formValues.hashtags,
          id as string
        );
        toast.success("Video updated successfully", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
        });
        setEditing(false);
        navigate("/video/" + id, { replace: true });
      } catch (error) {
        toast.error("Error updating video", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
        });
        setEditing(false);
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Call API to delete video
      console.log("Delete video");
      const data = await deleteVideo(id as string);
      toast.success("Video deleted successfully", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
      });

      setDeleting(false);
      navigate("/home", { replace: true });
    } catch (error) {
      toast.error("Error deleting video", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
      });
      setDeleting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Edit Video
        </Typography>
        <Box component="form" noValidate onSubmit={handleUpdate} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoComplete="title"
            autoFocus
            value={formValues.title}
            onChange={handleChange}
            error={!!formErrors.title}
            helperText={formErrors.title}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            autoComplete="description"
            value={formValues.description}
            onChange={handleChange}
            error={!!formErrors.description}
            helperText={formErrors.description}
          />
          <TextField
            margin="normal"
            fullWidth
            id="new-hashtag"
            label="Add Hashtags (press Enter to add)"
            value={newHashtag}
            onChange={handleHashtagChange}
            onKeyDown={handleAddHashtag}
            variant="outlined"
            helperText="Type a hashtag and press Enter"
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
          {editing || deleting ? (
            <CircularProgress
              color="primary"
              size={24}
              sx={{ mt: 2, alignSelf: "center" }}
            />
          ) : (
            <>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#222831", color: "#ffffff" }}
              >
                Update
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                sx={{ mt: 1, mb: 2 }}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default EditVideoPage;
