'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/material';
import { getCities } from 'countries-cities';
import  ImageDropzone  from '../common/ImageDropzone';



function CarDetailsStep() {
  const { register, setValue, watch, control } = useFormContext();

 
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [isCustomYear, setIsCustomYear] = useState(false);
  const [generationsAvailable, setGenerationsAvailable] = useState(true);
  const pakCities = getCities('Pakistan');

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



  return (
    <div className="row">
        <div className="section-title mb-30 text-center">
                          <h2>Car <span>Details</span></h2>
                        </div>
      {/* Make */}
      <div className="col-md-6 mb-20">
        <Controller
          name="car_make"
          control={control}
         // defaultValue=""
          rules={{
            required: 'Make is required',
            validate: value => value.trim() !== '' || 'Make is required'
          }}
          
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
              renderInput={(params) => <TextField {...params} label="Make" placeholder="Select or enter make" fullWidth error={!!fieldState.error}
              helperText={fieldState.error?.message}
              />}
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
              freeSolo
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
                <TextField {...params} label="Year" placeholder="Select or enter year" fullWidth/>
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
          rules={{ required: true }}
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
                <TextField {...params} label="Trim" placeholder="Select or enter variant" fullWidth/>
              )}
            />
          )}
        />
        <input type="hidden" {...register('version_id')} />
        <input type="hidden" {...register('generation_id')} />
      </div>

    {/* Other Fields */}
    <div className="col-md-6 mb-20">
        <Controller
            name="registration_city"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <Autocomplete
                    freeSolo
                    options={pakCities}
                    getOptionLabel={(option) => option}
                    isOptionEqualToValue={(option, value) => option === value}
                    value={field.value || ''}
                    onInputChange={(_, newInputValue) => field.onChange(newInputValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Registration City" fullWidth />
                    )}
                />
            )}
        />
    </div>

    <div className="col-md-6 mb-20">
        <Controller
            name="mileage"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <TextField
                    {...field}
                    label="Mileage"
                    type="number"
                    fullWidth
                />
            )}
        />
    </div>

    <div className="col-md-6 mb-20">
        <Controller
            name="demand_price"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <TextField
                    {...field}
                    label="Demand price"
                    type="number"
                    fullWidth
                />
            )}
        />
    </div>
    <div className="col-md-6 mb-20">
        <Controller
            name="city"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <Autocomplete
                    disableClearable
                    options={['Lahore', 'Islamabad']}
                    getOptionLabel={(option) => option}
                    isOptionEqualToValue={(option, value) => option === value}
                    value={field.value || ''}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="City"
                            fullWidth
                        />
                    )}
                />
            )}
        />
    </div>

    <div className="col-md-12 mb-20">
        <Controller
            name="description"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <TextField
                    {...field}
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                />
            )}
        />
    </div>

    

    <div className="col-md-12 mb-20">
        <ImageDropzone name="featuredImage" label="Featured Image" imageLimit={1} />
    </div>
      <div className="col-md-12 mb-20">
        <ImageDropzone name="carImages" label="Car Images" imageLimit={10} />
      
      </div>
    </div>
  );
}

export default CarDetailsStep;
