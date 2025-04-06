'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'axios';

function CarDetailsStep() {
  const { register, setValue, watch } = useFormContext();

  const [featuredImage, setFeaturedImage] = useState(null);
  const [carImages, setCarImages] = useState([]);

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);

  const [showMakeInput, setShowMakeInput] = useState(false);
  const [showModelInput, setShowModelInput] = useState(false);
  const [showVariantInput, setShowVariantInput] = useState(false);
  const [showYearInput, setShowYearInput] = useState(false);

  const selectedMake = watch('car_make');
  const selectedModel = watch('model');
  const selectedYear = watch('year_model');

  // Load makes on mount
  useEffect(() => {
    axios.get('https://api.carmandi.com.pk/api/dropdowns/makes')
      .then(res => setMakes(res.data));
  }, []);

  // Load models when make changes
  useEffect(() => {
    if (selectedMake && selectedMake !== 'other') {
      axios.get('https://api.carmandi.com.pk/api/dropdowns/models', { params: { make_id: selectedMake } })
        .then(res => setModels(res.data));
    } else {
      setModels([]);
    }
    setVariants([]);
    setYearOptions([]);
  }, [selectedMake]);

  // Load year options when model changes
  useEffect(() => {
    if (selectedModel && selectedModel !== 'other') {
      axios.get('https://api.carmandi.com.pk/api/dropdowns/years', { params: { model_id: selectedModel } })
        .then(res => {
          const years = [];
          res.data.forEach(row => {
            for (let y = row.start_year; y <= row.end_year; y++) {
              years.push({ year: y, generation_id: row.generation_id });
            }
          });
          setYearOptions(years.sort((a, b) => b.year - a.year));
        });
    } else {
      setYearOptions([]);
    }
    setVariants([]);
  }, [selectedModel]);

  // Load variants when year is selected
  useEffect(() => {
    if (selectedModel && selectedModel !== 'other' && selectedYear && selectedYear !== 'other') {
      axios.get('https://api.carmandi.com.pk/api/dropdowns/variants', {
        params: {
          model_id: selectedModel,
          year: selectedYear
        }
      })
        .then(res => setVariants(res.data));
    } else {
      setVariants([]);
    }
  }, [selectedModel, selectedYear]);

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
        <label>Make*</label>
        <select
          {...register('car_make', {
            required: true,
            onChange: (e) => {
              const isOther = e.target.value === 'other';
              setShowMakeInput(isOther);
              const selected = makes.find(m => m.id.toString() === e.target.value);
              if (selected) {
                setValue('car_make', selected.name);
                setValue('make_id', selected.id);
              } else {
                setValue('make_id', null);
              }
            }
          })}
          className="form-control"
        >
          <option value="">Select Make</option>
          {makes.map(make => (
            <option key={make.id} value={make.id}>{make.name}</option>
          ))}
          <option value="other">Other</option>
        </select>
        {showMakeInput && (
          <input type="text" {...register('car_make_other')} placeholder="Enter other make" className="form-control mt-2" />
        )}
        <input type="hidden" {...register('make_id')} />
      </div>

      {/* Model */}
      <div className="col-md-6 mb-20">
        <label>Model*</label>
        <select
          {...register('model', {
            required: true,
            onChange: (e) => {
              const isOther = e.target.value === 'other';
              setShowModelInput(isOther);
              const selected = models.find(m => m.id.toString() === e.target.value);
              if (selected) {
                setValue('model', selected.name);
                setValue('model_id', selected.id);
              } else {
                setValue('model_id', null);
              }
            }
          })}
          className="form-control"
        >
          <option value="">Select Model</option>
          {models.map(model => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
          <option value="other">Other</option>
        </select>
        {showModelInput && (
          <input type="text" {...register('model_other')} placeholder="Enter other model" className="form-control mt-2" />
        )}
        <input type="hidden" {...register('model_id')} />
      </div>

      {/* Year */}
      <div className="col-md-6 mb-20">
        <label>Year Model*</label>
        <select
          {...register('year_model', {
            required: true,
            onChange: (e) => {
              const year = e.target.value;
              const genId = e.target.selectedOptions[0]?.getAttribute('data-generation');
              setShowYearInput(year === 'other');
              if (year !== 'other') {
                setValue('year_model', year);
                setValue('generation_id', genId);
              } else {
                setValue('generation_id', null);
              }
            }
          })}
          className="form-control"
        >
          <option value="">Select Year</option>
          {yearOptions.map(option => (
            <option key={option.year} value={option.year} data-generation={option.generation_id}>
              {option.year}
            </option>
          ))}
          <option value="other">Other</option>
        </select>
        {showYearInput && (
          <input type="text" {...register('year_model_other')} placeholder="Enter other year" className="form-control mt-2" />
        )}
        <input type="hidden" {...register('generation_id')} />
      </div>

      {/* Trim */}
      <div className="col-md-6 mb-20">
        <label>Trim*</label>
        <select
          {...register('variant', {
            required: true,
            onChange: (e) => {
              const val = e.target.value;
              setShowVariantInput(val === 'other');
              if (val !== 'other') {
                setValue('version_id', val);
              } else {
                setValue('version_id', null);
              }
            }
          })}
          className="form-control"
        >
          <option value="">Select Variant</option>
          {variants.map(variant => (
            <option key={variant.id} value={variant.id}>{variant.version_name}</option>
          ))}
          <option value="other">Other</option>
        </select>
        {showVariantInput && (
          <input type="text" {...register('variant_other')} placeholder="Enter other variant" className="form-control mt-2" />
        )}
        <input type="hidden" {...register('version_id')} />
      </div>

      {/* Other fields below (unchanged) */}
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
        {featuredImage && (
          <img src={URL.createObjectURL(featuredImage)} alt="Featured" className="mt-2 max-h-40" />
        )}
      </div>

      {/* Car Images */}
      <div className="col-md-6 mb-20">
        <label>Car Images*</label>
        <input type="file" multiple onChange={handleCarImagesChange} accept="image/*" className="form-control" />
        <div className="flex mt-2 flex-wrap">
          {carImages.map((image, index) => (
            <img key={index} src={URL.createObjectURL(image)} alt={`Car ${index}`} className="max-h-40 mr-2 mb-2" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarDetailsStep;
