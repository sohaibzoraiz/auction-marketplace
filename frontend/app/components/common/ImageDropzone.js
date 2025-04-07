'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext, Controller } from 'react-hook-form';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';

const ImageDropzone = ({ name, label, imageLimit = 1 }) => {
  const { control, setValue, getValues } = useFormContext();

  const handleDrop = useCallback((acceptedFiles, name, imageLimit) => {
    const currentFiles = getValues(name) || [];
    const updated = imageLimit === 1
      ? [acceptedFiles[0]]
      : [...currentFiles, ...acceptedFiles].slice(0, imageLimit);
    setValue(name, updated, { shouldValidate: true });
  }, [getValues, setValue]);

  const removeImage = (fileToRemove, name) => {
    const currentFiles = getValues(name) || [];
    const updated = currentFiles.filter(file => file !== fileToRemove);
    setValue(name, updated, { shouldValidate: true });
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field, fieldState }) => {
        const files = Array.isArray(field.value) ? field.value : field.value ? [field.value] : [];

        const onDrop = useCallback((acceptedFiles) => {
          handleDrop(acceptedFiles, name, imageLimit);
        }, [handleDrop, name, imageLimit]);

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          accept: { 'image/*': [] },
          multiple: imageLimit > 1,
          onDrop,
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
                bgcolor: isDragActive ? '#f9f9f9' : 'inherit',
                cursor: 'pointer'
              }}
            >
              <input {...getInputProps()} />
              <UploadFileIcon sx={{ fontSize: 40, color: '#888' }} />
              <Typography variant="body2" mt={1}>
                {isDragActive ? 'Drop the image(s) here...' : `Click or drag to upload (Max ${imageLimit})`}
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
                        onClick={() => removeImage(file, name)}
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
              <Typography color="error" variant="caption">This field is required.</Typography>
            )}
          </Box>
        );
      }}
    />
  );
};

export default ImageDropzone;
