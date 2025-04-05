'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

function CarDetailsStep() {
  const { register, setValue, watch } = useFormContext();

  const [featuredImage, setFeaturedImage] = useState(null);
  const [carImages, setCarImages] = useState([]);

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    setFeaturedImage(file);

    // Save it in RHF state as part of car_photos_jsonb
    const currentImages = watch('car_photos_jsonb') || [];
    setValue('car_photos_jsonb', [file, ...currentImages.filter(f => f !== file)]);
  };

  const handleCarImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setCarImages(files);

    // Combine with featured image and save to RHF state
    const allImages = [featuredImage, ...files].filter(Boolean);
    setValue('car_photos_jsonb', allImages);
  };

  return (
    <div className="row">
      <div className="col-md-6 mb-20">
        <label>Make*</label>
        <input type="text" {...register('car_make', { required: true })} className="form-control" />
      </div>

      <div className="col-md-6 mb-20">
        <label>Model*</label>
        <input type="text" {...register('model', { required: true })} className="form-control" />
      </div>

      <div className="col-md-6 mb-20">
        <label>Trim*</label>
        <input type="text" {...register('variant', { required: true })} className="form-control" />
      </div>

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
