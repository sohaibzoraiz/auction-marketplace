'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';

const ImageDropzone = ({ name, label, imageLimit = 1 }) => {
  const { setValue, getValues, register, formState } = useFormContext();

  const currentFiles = getValues(name) || [];

  const onDrop = (acceptedFiles) => {
    const updated =
      imageLimit === 1
        ? [acceptedFiles[0]]
        : [...currentFiles, ...acceptedFiles].slice(0, imageLimit);
    setValue(name, updated, { shouldValidate: true });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: imageLimit > 1,
    onDrop,
  });

  const removeImage = (fileToRemove) => {
    const updated = currentFiles.filter((file) => file !== fileToRemove);
    setValue(name, updated, { shouldValidate: true });
  };

  const error = formState.errors?.[name];

  return (
    <Box mb={2}>
      <Typography variant="subtitle1" gutterBottom>{label}</Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          padding: 2,
          borderRadius: 2,
          textAlign: 'center',
          bgcolor: isDragActive ? '#f9f9f9' : 'inherit',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} {...register(name, { required: true })} />
        <UploadFileIcon sx={{ fontSize: 40, color: '#888' }} />
        <Typography variant="body2" mt={1}>
          {isDragActive ? 'Drop the image(s) here...' : `Click or drag to upload (Max ${imageLimit})`}
        </Typography>
      </Box>

      {currentFiles.length > 0 && (
        <Grid container spacing={2} mt={1}>
          {currentFiles.map((file, index) => (
            <Grid item key={index}>
              <Box position="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(file)}
                  sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'white' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {error && (
        <Typography color="error" variant="caption">
          {error.message || 'This field is required.'}
        </Typography>
      )}
    </Box>
  );
};

export default ImageDropzone;
