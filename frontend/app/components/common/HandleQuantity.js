"use client";
import React, { useReducer, useEffect } from "react";

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
      let newValue = Math.floor(action.payload / 10000) * 10000; // Snap to nearest 10,000
      if (isNaN(newValue)) return state; // Prevent invalid input

      if (newValue < state.minLimit) {
        return { ...state, quantity: state.minLimit, showMinLimitMessage: true };
      }
      if (newValue > state.maxLimit) {
        return { ...state, quantity: state.maxLimit, showMaxLimitMessage: true };
      }
      return { ...state, quantity: newValue, showMaxLimitMessage: false, showMinLimitMessage: false };
    }

    case "UPDATE_LIMITS": {
      const newMinLimit = Math.floor(action.payload); // Ensure integer
      const newMaxLimit = newMinLimit + Math.floor(newMinLimit * 0.1); // 10% above current price
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

function HandleQuantity({ currentPrice, onQuantityChange }) {
  const [state, dispatch] = useReducer(quantityReducer, {
    quantity: Math.floor(currentPrice), // Ensure integer initial value
    minLimit: Math.floor(currentPrice),
    maxLimit: Math.floor(currentPrice + currentPrice * 0.1), // 10% limit
    showMaxLimitMessage: false,
    showMinLimitMessage: false,
  });

  // Notify parent of quantity change
  useEffect(() => {
    onQuantityChange(state.quantity);
  }, [state.quantity, onQuantityChange]);

  // Update limits if `currentPrice` changes
  useEffect(() => {
    if (Math.floor(currentPrice) !== state.minLimit) {
      dispatch({ type: "UPDATE_LIMITS", payload: currentPrice });
    }
  }, [currentPrice]);

  const increment = () => dispatch({ type: "INCREMENT" });
  const decrement = () => dispatch({ type: "DECREMENT" });

  const handleInputChange = (e) => {
    let newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      dispatch({ type: "SET", payload: newValue });
    }
  };

  return (
    <div className="quantity-counter">
      <a className="quantity__minus" style={{ cursor: "pointer" }} onClick={decrement}>
        <i className="bx bx-minus" />
      </a>
      <input
        name="quantity"
        type="text"
        value={state.quantity}
        onChange={handleInputChange}
        className="quantity__input"
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
