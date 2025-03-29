"use client";
import React, { useReducer, useEffect, useState } from "react";

// Reducer function to manage quantity state
function quantityReducer(state, action) {
  switch (action.type) {
    case "INCREMENT": {
      const newValue = state.quantity + 10000;
      if (newValue > state.maxLimit) {
        return { ...state, showMaxLimitMessage: true }; // Show max limit message
      }
      return { ...state, quantity: newValue, showMaxLimitMessage: false };
    }

    case "DECREMENT": {
      const newValue = state.quantity - 10000;
      if (newValue < state.minLimit) {
        return { ...state, showMinLimitMessage: true }; // Show min limit message
      }
      return { ...state, quantity: newValue, showMinLimitMessage: false };
    }

    case "SET": {
      let newValue = action.payload === "" ? "" : Math.floor(action.payload);
    
      if (newValue === "") return { ...state, quantity: "" }; // ✅ Allow temporary empty input
    
      if (newValue < state.minLimit) {
        return { ...state, quantity: newValue, showMinLimitMessage: true }; // ✅ Keep user input, just show warning
      }
      if (newValue > state.maxLimit) {
        return { ...state, quantity: state.maxLimit, showMaxLimitMessage: true };
      }
    
      return { ...state, quantity: newValue, showMaxLimitMessage: false, showMinLimitMessage: false };
    }
    

    case "UPDATE_LIMITS": {
      const newMinLimit = Math.floor(action.payload)+10000;
      const newMaxLimit = newMinLimit + Math.floor(newMinLimit * 0.1);
      return {
        ...state,
        quantity: newMinLimit,
        minLimit: newMinLimit,
        maxLimit: newMaxLimit,
        showMaxLimitMessage: false,
        showMinLimitMessage: false,
      };
    }

    default:
      return state;
  }
}

function HandleQuantity({ currentPrice, onQuantityChange, lastBidFromDB }) {
  const [state, dispatch] = useReducer(quantityReducer, {
    quantity: Math.floor(currentPrice+10000),
    minLimit: Math.floor(currentPrice+10000),
    maxLimit: Math.floor(currentPrice + currentPrice * 0.1),
    showMaxLimitMessage: false,
    showMinLimitMessage: false,
  });

  const [inputValue, setInputValue] = useState(state.quantity.toString());

  // ✅ Sync input value with state when it changes
  useEffect(() => {
    setInputValue(state.quantity.toString());
  }, [state.quantity]);

  // ✅ Notify parent component IMMEDIATELY when quantity changes
  useEffect(() => {
    onQuantityChange(state.quantity);
  }, [state.quantity, onQuantityChange]);

  // ✅ Update limits when new bid is received
  useEffect(() => {
    if (lastBidFromDB && Math.floor(lastBidFromDB)+10000 !== state.minLimit) {
      dispatch({ type: "UPDATE_LIMITS", payload: lastBidFromDB });
    }
  }, [lastBidFromDB]); // ✅ Ensures proper updates without resetting manual input
  

  const increment = () => dispatch({ type: "INCREMENT" });
  const decrement = () => dispatch({ type: "DECREMENT" });

  // ✅ Updates state IMMEDIATELY when typing (fixing place bid issue)
  const handleInputChange = (e) => {
    let newValue = e.target.value.replace(/\D/g, ""); // ✅ Only allow numbers
    setInputValue(newValue); // ✅ Show input immediately
    dispatch({ type: "SET", payload: parseInt(newValue, 10) || 0 });
  };

  return (
    <div className="quantity-counter">
      <a className="quantity__minus" style={{ cursor: "pointer" }} onClick={decrement}>
        <i className="bx bx-minus" />
      </a>
      <input
        name="quantity"
        type="text"
        value={inputValue}
        onChange={handleInputChange} // ✅ Updates immediately
        className="quantity__input"
        placeholder={`Min: ${state.minLimit}`}
      />
      <a className="quantity__plus" style={{ cursor: "pointer" }} onClick={increment}>
        <i className="bx bx-plus" />
      </a>

      {/* Show max limit message */}
      {state.showMaxLimitMessage && (
        <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
          Maximum bid limit reached!
        </p>
      )}

      {/* Show min limit message */}
      {state.showMinLimitMessage && (
        <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
          Minimum bid is PKR {state.minLimit}
        </p>
      )}
    </div>
  );
}

export default HandleQuantity;
