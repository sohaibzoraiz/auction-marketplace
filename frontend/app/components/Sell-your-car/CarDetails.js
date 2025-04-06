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
  const [generationsAvailable, setGenerationsAvailable] = useState(true);

  const selectedMakeId = watch('make_id');
  const selectedModelId = watch('model_id');
  const selectedYear = watch('year_model');

  // Load makes
  useEffect(() => {
    axios.get('https://api.carmandi.com.pk/api/dropdowns/makes')
      .then(res => setMakes(res.data));
  }, []);

  // Load models on make change
  useEffect(() => {
    if (selectedMakeId && selectedMakeId !== 'other') {
      axios.get('https://api.carmandi.com.pk/api/dropdowns/models', {
        params: { make_id: selectedMakeId }
      }).then(res => setModels(res.data));
    } else {
      setModels([]);
    }
    setVariants([]);
    setYearOptions([]);
  }, [selectedMakeId]);

  // Load years on model change
  useEffect(() => {
    if (selectedModelId && selectedModelId !== 'other') {
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
        setShowYearInput(!hasGenerations); // fallback if no year data
      });
    } else {
      setYearOptions([]);
      setGenerationsAvailable(false);
      setShowYearInput(false);
    }

    setVariants([]);
  }, [selectedModelId]);

  // Load variants on year or model change
  useEffect(() => {
    if (selectedModelId && selectedModelId !== 'other') {
      if (generationsAvailable && selectedYear && selectedYear !== 'other') {
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

  // Image handlers
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

      {/* MAKE */}
      <div className="col-md-6 mb-20">
        <label>Make*</label>
        <select
          className="form-control"
          value={selectedMakeId || ''}
          onChange={(e) => {
            const val = e.target.value;
            const isOther = val === 'other';
            setShowMakeInput(isOther);
            const selected = makes.find(m => m.id.toString() === val);
            setValue('make_id', isOther ? null : selected?.id || null);
            setValue('car_make', isOther ? '' : selected?.name || '');
          }}
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
        <input type="hidden" {...register('car_make')} />
      </div>

      {/* MODEL */}
      <div className="col-md-6 mb-20">
        <label>Model*</label>
        <select
          className="form-control"
          value={selectedModelId || ''}
          onChange={(e) => {
            const val = e.target.value;
            const isOther = val === 'other';
            setShowModelInput(isOther);
            const selected = models.find(m => m.id.toString() === val);
            setValue('model_id', isOther ? null : selected?.id || null);
            setValue('model', isOther ? '' : selected?.name || '');
          }}
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
        <input type="hidden" {...register('model')} />
      </div>

      {/* YEAR */}
      <div className="col-md-6 mb-20">
        <label>Year Model*</label>
        {generationsAvailable ? (
          <>
            <select
              {...register('year_model', {
                required: true,
                onChange: (e) => {
                  const val = e.target.value;
                  setShowYearInput(val === 'other');
                  setValue('year_model', val);
                },
              })}
              className="form-control"
            >
              <option value="">Select Year</option>
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
              <option value="other">Other</option>
            </select>
            {showYearInput && (
              <input type="text" {...register('year_model_other')} placeholder="Enter other year" className="form-control mt-2" />
            )}
          </>
        ) : (
          <>
            <input type="text" {...register('year_model')} placeholder="Enter year" className="form-control" />
          </>
        )}
        <input type="hidden" {...register('generation_id')} />
      </div>

      {/* TRIM / VERSION */}
      <div className="col-md-6 mb-20">
        <label>Trim*</label>
        <select
          className="form-control"
          value={watch('version_id') || ''}
          onChange={(e) => {
            const val = e.target.value;
            const isOther = val === 'other';
            setShowVariantInput(isOther);
            const selected = variants.find(v => v.id.toString() === val);
            setValue('variant', selected?.version_name || '');
            setValue('version_id', isOther ? null : selected?.id || null);
            setValue('generation_id', isOther ? null : selected?.generation_id || null); // ✅ Now set generation_id here
          }}
        >
          <option value="">Select Variant</option>
          {variants.map(v => (
            <option key={v.id} value={v.id}>{v.version_name}</option>
          ))}
          <option value="other">Other</option>
        </select>
        {showVariantInput && (
          <input type="text" {...register('variant_other')} placeholder="Enter other variant" className="form-control mt-2" />
        )}
        <input type="hidden" {...register('version_id')} />
        <input type="hidden" {...register('variant')} />
      </div>

      {/* Remaining fields */}
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
          {carImages.map((img, i) => (
            <img key={i} src={URL.createObjectURL(img)} alt={`Car ${i}`} className="max-h-40 mr-2 mb-2" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarDetailsStep;
