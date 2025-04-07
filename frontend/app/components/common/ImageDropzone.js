// components/common/ImageDropzone.js
'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useController, useFormContext } from 'react-hook-form';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';

const ImageDropzone = ({ name, label, imageLimit = 1 }) => {
  const { control, setValue } = useFormContext();
  const { field, fieldState } = useController({ name, control, rules: { required: true } });

  const files = Array.isArray(field.value)
    ? field.value
    : field.value
    ? [field.value]
    : [];

  const onDrop = (acceptedFiles) => {
    const newFiles =
      imageLimit === 1 ? [acceptedFiles[0]] : [...files, ...acceptedFiles].slice(0, imageLimit);
    field.onChange(newFiles);
    setValue(name, newFiles, { shouldValidate: true });
  };

  const removeImage = (fileToRemove) => {
    const updated = files.filter((f) => f !== fileToRemove);
    field.onChange(updated);
    setValue(name, updated, { shouldValidate: true });
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: imageLimit > 1,
    noClick: true,
    noKeyboard: true,
  });

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
          cursor: 'pointer',
          bgcolor: isDragActive ? '#f9f9f9' : 'inherit',
        }}
        onClick={open}
      >
        <input {...getInputProps()} />
        <UploadFileIcon sx={{ fontSize: 40, color: '#888' }} />
        <Typography variant="body2" mt={1}>
          Click or drag to upload (Max {imageLimit})
        </Typography>
      </Box>

      {files.length > 0 && (
        <Grid container spacing={2} mt={1}>
          {files.map((file, index) => (
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

      {fieldState.error && (
        <Typography color="error" variant="caption">
          This field is required.
        </Typography>
      )}
    </Box>
  );
};

export default ImageDropzone;
