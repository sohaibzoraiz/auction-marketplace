'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

function PaymentStep() {
  const { register, setValue, watch } = useFormContext();
  const [paymentMethod, setPaymentMethod] = useState('');
  const inspectionCharges = 2500; // Inspection fee of 2500 PKR

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    setValue('payment_method', method); // Update payment method in the form state
  };

  return (
    <div className="row">
      {/* Payment Method Selection */}
      <div className="col-md-12 mb-20">
        <h3>Select Payment Method</h3>
        <button type="button" onClick={() => handlePaymentSelect('COD')} className="btn btn-primary">Cash on Delivery</button>
        <button type="button" onClick={() => handlePaymentSelect('BankTransfer')} className="btn btn-primary">Bank Transfer</button>
        <button type="button" onClick={() => handlePaymentSelect('Card')} className="btn btn-primary">Credit/Debit Card</button>
      </div>

      {/* Show relevant fields based on selected payment method */}
      {paymentMethod === 'COD' && (
        <div className="col-md-12 mb-20">
          <h3>Cash on Delivery Selected</h3>
          <p>Your order will be delivered and paid for upon delivery.</p>
        </div>
      )}

      {paymentMethod === 'BankTransfer' && (
        <div className="col-md-12 mb-20">
          <h3>Bank Transfer Selected</h3>
          <p>Please use the following details to make your payment:</p>
          <div>
            <p>Account Name: XYZ Motors</p>
            <p>Bank: ABC Bank</p>
            <p>Account Number: 1234567890</p>
            <p>Sort Code: 112233</p>
          </div>
        </div>
      )}

      {paymentMethod === 'Card' && (
        <div className="col-md-12 mb-20">
          <h3>Enter Payment Details</h3>
          <div className="mb-3">
            <label>Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9101 1121"
              {...register('card_number', { required: true })}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Expiration Date</label>
            <input
              type="text"
              placeholder="MM/YY"
              {...register('expiration_date', { required: true })}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>CVV</label>
            <input
              type="text"
              placeholder="123"
              {...register('cvv', { required: true })}
              className="form-control"
            />
          </div>
        </div>
      )}

      {/* Inspection Charges */}
      <div className="col-md-12 mb-20">
        <h3>Inspection Charges</h3>
        <div>
          <span>Inspection Fee</span>
          <span>PKR {inspectionCharges}</span>
        </div>
      </div>
    </div>
  );
}

export default PaymentStep;
