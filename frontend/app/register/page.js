"use client";

import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Modal from "../components/auction-single/modal";
import Breadcrumb2 from "../components/common/Breadcrumb2";
import axios from 'axios';
import { UserContext } from "../contexts/UserContext";


const RegisterPage = () => {
  const router = useRouter();
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
  const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors } = useForm();
  const { userData, isLoading } = useContext(UserContext) ?? {};
  useEffect(() => {
        if (!isLoading && userData) {
            const originalUrl = new URLSearchParams(window.location.search).get("redirect") || "/";
            router.push(originalUrl); // Redirect to previous page or home
        }
    }, [isLoading, userData, router]);
  
  
  const onSubmit = async (data) => {
    if (step === 2) {
      try {
        const res = await axios.post('https://api.carmandi.com.pk/api/auth/validate-email-phone', {
          email_address: data.email_address,
          contact_number: data.contact_number,
        });
    
        if (res.status === 200) {
          clearErrors(['email_address', 'contact_number']);
          setStep(3); // ✅ Go to next step
        }
      } catch (error) {
        if (error.response?.data?.message.includes("Email")) {
          setError("email_address", {
            type: "manual",
            message: error.response.data.message,
          });
        }
        if (error.response?.data?.message.includes("Phone")) {
          setError("contact_number", {
            type: "manual",
            message: error.response.data.message,
          });
        }
    
        return; // ❌ Prevent going to next step
      }
    
      return;
    }
    
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
  if (isLoading) return <p>Loading...</p>;
    if (userData) return null;
  // Progress bar calculation
  const progress = (step / 3) * 100;

  return (
    <>
    <Breadcrumb2 pagetitle="Register" currentPage="register" />
    <div className="container pt-110 mb-110">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="contact-form-area">
            <div className="section-title mb-30 text-center">
                  <h2>Sign <span>Up</span></h2>
                </div>
        {/* Bootstrap Progress Bar */}
        <div className="progress mb-4" style={{height: "30px", backgroundColor: "#e9ecef"}}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${progress}%` , height: "30px", backgroundColor: "#01aa85"}}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span className="progress-text" style={{ position: "relative", width: "100%", textAlign: "center", color: "#fff", fontWeight: "bold" }}>  
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
              <input {...register("contact_number", {   required: "Valid phone number required",
               pattern: { value: /^[0-9+]{10,15}$/,  message: "Phone number format invalid" }})}
               className="form-control" />
              {errors.contact_number && <p className="text-danger">{errors.contact_number.message}</p>}

              <label>Email:</label>
              <input type="email" {...register("email_address", { required: "Valid email required",
                 pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Invalid email format" }})}
                className="form-control"/>
              {errors.email_address && <p className="text-danger">{errors.email_address.message}</p>}



              <label>Password:</label>
              <input type="password" {...register("password", { required: true })} className="form-control" />
              {errors.password && <p className="text-danger">Password is required</p>}

              <label>Confirm Password:</label>
              <input type="password" {...register("confirm_password", { required: true, validate: (value) => value === watch("password") || "Passwords do not match" })} 
              className="form-control"/>
              {errors.confirm_password && <p className="text-danger">{errors.confirm_password.message}</p>}


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
              <span style={{ top: "40.5px", left: "84.2344px" }} />
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
    </div>
        </div>
      
    </>
  );
};

export default RegisterPage;
