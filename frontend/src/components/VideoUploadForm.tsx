import React, { useState } from "react";
import { VideoFormErrors, VideoFormValues } from "../models/VideoFormType";
import { validateVideoForm } from "../utils/Validation";
import { Container } from "@mui/material";

const VideoUploadForm = () => {
  const [formValues, setFormValues] = useState<VideoFormValues>({
    url: "",
    title: "",
  });
  const [formErrors, setFormErrors] = useState<VideoFormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submission", formValues);
    const validationErrors = validateVideoForm(formValues);
    setFormErrors(validationErrors);
    console.log(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, proceed with submission
      console.log("Form submission", formValues);
      // TODO: Call the service to upload the video
    }
  };
  return (
    <>
      <Container component="main" maxWidth="xs">
    

      </Container>
    </>
  );
};
