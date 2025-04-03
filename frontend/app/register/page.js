"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Modal from "../components/auction-single/modal";
import Breadcrumb2 from "../components/common/Breadcrumb2";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [customerType, setCustomerType] = useState("individual");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    content: "",
    type: "",
    buttonText: "",
    buttonAction: () => {},
    autoRedirect: false
  });
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        // Create a FormData object to handle file uploads
        const formData = new FormData();
  
        // Append non-file fields
        formData.append('name', data.name);
        formData.append('contact_number', data.contact_number);
        formData.append('email_address', data.email_address);
        formData.append('password', data.password);
        formData.append('confirm_password', data.confirm_password);
        formData.append('complete_address', data.complete_address);
        formData.append('customer_type', data.customer_type);
        formData.append('identification_number', data.identification_number);
  
        // Append files if available
        if (data.id_image && data.id_image[0]) {
          formData.append('id_image', data.id_image[0]);
        }
        if (data.profile_picture && data.profile_picture[0]) {
          formData.append('profile_picture', data.profile_picture[0]);
        }
        // Check if the password and confirm password match
        if (data.password !== data.confirm_password) {
          setModalData({
            title: "Password Error!",
            content: "passwords do not match",
            type: "Error",
            buttonText: "Retry",
            buttonAction: () => setShowModal(false),
            autoRedirect: false
        });
        setShowModal(true);
          return;
        }
        
        // Send the data with fetch
        const response = await fetch("/api/auth/register", {
          method: "POST",
          body: formData, // Send the form data (including files)
        });
  
        if (!response.ok) throw new Error("Registration failed");
        setModalData({
          title: "Registration Successful!",
          content: "You have been successfully registered.",
          type: "Success",
          buttonText: "Redirecting...",
          buttonAction: () => window.location.href = `/login`,
          autoRedirect: true
      });
      setShowModal(true);
        //router.push("/login");
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Progress bar calculation
  const progress = (step / 3) * 100;

  return (
    <>
    <Breadcrumb2 pagetitle="Register" currentPage="register" />
    <div className="container mt-5">
      <div className="card p-4">

        {/* Bootstrap Progress Bar */}
        <div className="progress mb-4" style={{height: "30px", backgroundColor: "#e9ecef"}}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` , height: "30px", backgroundColor: "#007bff"}}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span className="progress-text" style={{ position: "relative", width: "100%", textAlign: "center", color: "#fff" }}>
      Step {step} of 3
    </span>
          </div>
        </div>

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
                {...register("identification_number", { required: true })}
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
            <button type="submit" className="primary-btn btn-hover">
              {step < 3 ? "Next" : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {showModal && (
    <Modal 
        title={modalData.title}
        content={modalData.content}
        type={modalData.type}
        buttonText={modalData.buttonText}
        buttonAction={modalData.buttonAction}
        autoRedirect={modalData.autoRedirect}
        onClose={() => setShowModal(false)}
    />
)}
    </div>
    </>
  );
};

export default RegisterPage;
