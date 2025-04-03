"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [customerType, setCustomerType] = useState("individual");
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        // Create a FormData object to handle file uploads
        const formData = new FormData();
formData.append('name', 'Amad');
formData.append('contact_number', '032231241243');
formData.append('email_address', 'admin@carmandi.com.pk');
formData.append('complete_address', 'asdadssds');
formData.append('identification_number', '123123123123');
formData.append('password', 'password');
formData.append('customer_type', 'individual');
formData.append('profile_picture', fileInput.files[0]);  // Use actual file input element
formData.append('id_image', fileInput2.files[0]);        // Use actual file input element

// Ensure to log the form data before sending
console.log('Form data:', formData);

fetch('/api/auth/register', {
    method: 'POST',
    body: formData,
})
.then(response => response.json())
.then(data => {
    console.log('Response data:', data);
})
.catch(error => console.error('Error:', error));

      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4">
        <h2 className="text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div>
              <label>Choose Customer Type:</label>
              <select
                {...register("customer_type", { required: true })}
                onChange={(e) => setCustomerType(e.target.value)}
                className="form-control"
              >
                <option value="individual">Individual</option>
                <option value="dealer">Business / Car Dealer</option>
              </select>
              {errors.customer_type && <p className="text-danger">This field is required</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <label>{customerType === "individual" ? "Name" : "Business Name"}:</label>
              <input
                {...register("name", { required: true, minLength: 3 })}
                className="form-control"
              />
              {errors.name && <p className="text-danger">Minimum 3 characters required</p>}

              <label>Contact Number:</label>
              <input
                {...register("contact_number", { required: true, pattern: /^[0-9+]{10,15}$/ })}
                className="form-control"
              />
              {errors.contact_number && <p className="text-danger">Valid phone number required</p>}

              <label>Email:</label>
              <input
                type="email"
                {...register("email_address", { required: true, pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/ })}
                className="form-control"
              />
              {errors.email_address && <p className="text-danger">Valid email required</p>}

              <label>Password:</label>
              <input type="password" {...register("password", { required: true })} className="form-control" />
              {errors.password && <p className="text-danger">Password is required</p>}

              <label>Confirm Password:</label>
              <input type="password" {...register("confirm_password", { required: true })} className="form-control" />
              {errors.confirm_password && <p className="text-danger">Confirmation is required</p>}

              <label>Complete Address:</label>
              <textarea {...register("complete_address")} className="form-control"></textarea>
            </div>
          )}

          {step === 3 && (
            <div>
              <label>{customerType === "individual" ? "CNIC Number" : "Company Registration Number / NTN"}:</label>
              <input
                {...register("identification_number", { required: true})}
                className="form-control"
              />
              {errors.identification_number && <p className="text-danger">Must be a 13-digit number</p>}

              <label>{customerType === "individual" ? "CNIC Image" : "Business Registration Document"}:</label>
              <input type="file" {...register("id_image", { required: true })} className="form-control" />
              {errors.id_image && <p className="text-danger">Document is required</p>}

              <label>Profile Picture (Optional):</label>
              <input type="file" {...register("profile_picture")} className="form-control" />
            </div>
          )}

          <div className="d-flex justify-content-between mt-3">
            {step > 1 && (
              <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {step < 3 ? "Next" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm;
