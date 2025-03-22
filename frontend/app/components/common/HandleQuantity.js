"use client";
import React, { useReducer, useEffect } from "react";

// Reducer function to manage quantity state
function quantityReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      const newIncrement = state.quantity + 10000;
      if (newIncrement > state.maxLimit) {
        return { ...state, showMaxLimitMessage: true }; // Show message if exceeded
      }
      return { ...state, quantity: newIncrement, showMaxLimitMessage: false };

    case "DECREMENT":
      return {
        ...state,
        quantity: Math.max(state.quantity - 10000, state.minLimit),
        showMaxLimitMessage: false, // Reset message when decreasing
      };

    case "SET":
      const newValue = Math.floor(action.payload / 10000) * 10000;
      if (isNaN(newValue) || newValue < state.minLimit) return state;
      return {
        ...state,
        quantity: Math.min(newValue, state.maxLimit),
        showMaxLimitMessage: newValue >= state.maxLimit,
      };

    case "UPDATE_LIMITS":
      return {
        ...state,
        quantity: Math.max(action.payload, state.minLimit),
        minLimit: action.payload,
        maxLimit: action.payload + Math.floor(action.payload * 0.1), // 10% increase
        showMaxLimitMessage: false,
      };

    default:
      return state;
  }
}

function HandleQuantity({ currentPrice, onQuantityChange }) {
  const [state, dispatch] = useReducer(quantityReducer, {
    quantity: currentPrice || 10000, // Default to 10,000
    minLimit: currentPrice || 10000, // Minimum bid = current price
    maxLimit: (currentPrice || 10000) + Math.floor((currentPrice || 10000) * 0.1), // Max bid = +10%
    showMaxLimitMessage: false,
  });

  // Notify parent component of quantity change
  useEffect(() => {
    onQuantityChange(state.quantity);
  }, [state.quantity, onQuantityChange]);

  // Update limits if `currentPrice` changes
  useEffect(() => {
    if (currentPrice !== state.minLimit) {
      dispatch({ type: "UPDATE_LIMITS", payload: currentPrice });
    }
  }, [currentPrice]);

  const increment = () => dispatch({ type: "INCREMENT" });
  const decrement = () => dispatch({ type: "DECREMENT" });

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
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
    </div>
  );
}

export default HandleQuantity;
