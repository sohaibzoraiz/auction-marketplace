'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/material';

function CarDetailsStep() {
  const { register, setValue, watch, control } = useFormContext();

  const [featuredImage, setFeaturedImage] = useState(null);
  const [carImages, setCarImages] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [isCustomYear, setIsCustomYear] = useState(false);
  const [generationsAvailable, setGenerationsAvailable] = useState(true);

  const selectedMakeId = watch('make_id');
  const selectedModelId = watch('model_id');
  const selectedYear = watch('year_model');

  // Load Makes
  useEffect(() => {
    axios.get('https://api.carmandi.com.pk/api/dropdowns/makes').then(res => setMakes(res.data));
  }, []);

  // Load Models
  useEffect(() => {
    if (selectedMakeId) {
      axios.get('https://api.carmandi.com.pk/api/dropdowns/models', { params: { make_id: selectedMakeId } })
        .then(res => setModels(res.data));
    } else {
      setModels([]);
    }
    setYearOptions([]);
    setVariants([]);
  }, [selectedMakeId]);

  // Load Years
  useEffect(() => {
    if (selectedModelId) {
      axios.get('https://api.carmandi.com.pk/api/dropdowns/years', {
        params: { make_id: selectedMakeId, model_id: selectedModelId }
      }).then(res => {
        const uniqueYears = new Set();
        let hasGenerations = false;
        res.data.forEach(row => {
          if (row.start_year != null && row.end_year != null) {
            hasGenerations = true;
            for (let y = row.start_year; y <= row.end_year; y++) {
              uniqueYears.add(y);
            }
          }
        });
        setYearOptions(Array.from(uniqueYears).sort((a, b) => b - a));
        setGenerationsAvailable(hasGenerations);
      });
    } else {
      setYearOptions([]);
      setGenerationsAvailable(false);
    }
    setVariants([]);
  }, [selectedModelId]);

  // Load Variants
  useEffect(() => {
    if (selectedModelId) {
      if (generationsAvailable && selectedYear && !isCustomYear) {
        axios.get('https://api.carmandi.com.pk/api/dropdowns/variants', {
          params: { model_id: selectedModelId, year: selectedYear }
        }).then(res => setVariants(res.data));
      } else if (!generationsAvailable) {
        axios.get('https://api.carmandi.com.pk/api/dropdowns/variant-model', {
          params: { model_id: selectedModelId }
        }).then(res => setVariants(res.data));
      }
    }
  }, [selectedModelId, selectedYear, generationsAvailable]);

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    setFeaturedImage(file);
    const currentImages = watch('car_photos_jsonb') || [];
    setValue('car_photos_jsonb', [file, ...currentImages.filter(f => f !== file)]);
  };

  const handleCarImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setCarImages(files);
    const allImages = [featuredImage, ...files].filter(Boolean);
    setValue('car_photos_jsonb', allImages);
  };

  return (
    <div className="row">
      {/* Make */}
      <div className="col-md-6 mb-20">
        <Controller
          name="car_make"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Autocomplete
              options={makes}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              onChange={(_, newValue) => {
                setValue('make_id', newValue?.id || null);
                field.onChange(newValue?.name || '');
              }}
              onInputChange={(_, newInput) => {
                const match = makes.find(m => m.name.toLowerCase() === newInput.toLowerCase());
                setValue('make_id', match?.id || null);
                field.onChange(newInput);
              }}
              renderInput={(params) => <TextField {...params} label="Make" placeholder="Select or enter make" required />}
              freeSolo
            />
          )}
        />
        <input type="hidden" {...register('make_id')} />
      </div>

      {/* Model */}
      <div className="col-md-6 mb-20">
        <Controller
          name="model"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              options={models}
              getOptionLabel={(option) => option?.name || ''}
              value={models.find(m => m.name === value) || null}
              onInputChange={(_, newInput) => {
                const match = models.find(m => m.name.toLowerCase() === newInput.toLowerCase());
                setValue('model_id', match?.id || null);
                onChange(newInput);
              }}
              onChange={(_, selected) => {
                setValue('model_id', selected?.id || null);
                onChange(selected?.name || '');
              }}
              renderInput={(params) => <TextField {...params} label="Model" placeholder="Select or enter model" fullWidth />}
            />
          )}
        />
        <input type="hidden" {...register('model_id')} />
      </div>

      {/* Year */}
      <div className="col-md-6 mb-20">
        <Controller
          name="year_model"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Autocomplete
              freeSolo
              options={yearOptions}
              getOptionLabel={(option) => option?.toString() || ''}
              isOptionEqualToValue={(option, value) => option === value}
              value={field.value || ''}
              onInputChange={(_, newInput) => {
                field.onChange(newInput);
                setIsCustomYear(!yearOptions.includes(Number(newInput)));
              }}
              renderInput={(params) => (
                <TextField {...params} label="Year" placeholder="Select or enter year" fullWidth />
              )}
            />
          )}
        />
      </div>

      {/* Trim / Variant */}
      <div className="col-md-6 mb-20">
        <Controller
          name="variant"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Autocomplete
              freeSolo
              options={variants.map(v => v.version_name)}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              value={field.value || ''}
              onInputChange={(_, newInputValue) => {
                field.onChange(newInputValue);
                const match = variants.find(v => v.version_name === newInputValue);
                setValue('version_id', match?.id || null);
                setValue('generation_id', match?.generation_id || null);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Trim" placeholder="Select or enter variant" required fullWidth />
              )}
            />
          )}
        />
        <input type="hidden" {...register('version_id')} />
        <input type="hidden" {...register('generation_id')} />
      </div>

      {/* Other Fields */}
      <div className="col-md-6 mb-20">
        <label>Registration City*</label>
        <input type="text" {...register('registration_city', { required: true })} className="form-control" />
      </div>
      <div className="col-md-6 mb-20">
        <label>Mileage*</label>
        <input type="number" {...register('mileage', { required: true })} className="form-control" />
      </div>
      <div className="col-md-6 mb-20">
        <label>Demand Price*</label>
        <input type="number" {...register('demand_price', { required: true })} className="form-control" />
      </div>
      <div className="col-md-12 mb-20">
        <label>Description*</label>
        <textarea {...register('description', { required: true })} className="form-control" />
      </div>
      <div className="col-md-6 mb-20">
        <label>City*</label>
        <input type="text" {...register('city', { required: true })} className="form-control" />
      </div>

      {/* Featured Image */}
      <div className="col-md-6 mb-20">
        <label>Featured Image*</label>
        <input type="file" onChange={handleFeaturedImageChange} accept="image/*" className="form-control" />
        {featuredImage && <img src={URL.createObjectURL(featuredImage)} alt="Featured" className="mt-2 max-h-40" />}
      </div>

      {/* Car Images */}
      <div className="col-md-6 mb-20">
        <label>Car Images*</label>
        <input type="file" multiple onChange={handleCarImagesChange} accept="image/*" className="form-control" />
        <div className="flex mt-2 flex-wrap">
          {carImages.map((img, i) => (
            <img key={i} src={URL.createObjectURL(img)} alt={`Car ${i}`} className="max-h-40 mr-2 mb-2" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarDetailsStep;
