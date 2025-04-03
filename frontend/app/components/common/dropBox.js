// components/DropBoxUpload.js
import React from 'react';
import { useDropzone } from 'react-dropzone';

const DropBoxUpload = ({ name, setValue, errors, label }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*', // Only accept image files
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setValue(name, acceptedFiles[0]); // Set the file using React Hook Form
      }
    },
    maxFiles: 1, // Limit to 1 file
  });

  return (
    <div>
      <label>{label}</label>
      <div
        {...getRootProps()}
        className="dropbox-area"
        style={{
          border: '2px dashed #007bff',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: '#f8f9fa',
        }}
      >
        <input {...getInputProps()} />
        <p>{errors[name] ? 'Invalid file. Please upload an image.' : `Drag and drop a file here or click to upload`}</p>
      </div>
      {errors[name] && <p className="text-danger">{errors[name]?.message}</p>}
    </div>
  );
};

export default DropBoxUpload;
