"use client";
import React, { useReducer, useEffect } from "react";

// Reducer function to manage quantity state
function quantityReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        quantity: Math.min(state.quantity + 10000, state.maxLimit),
        maxLimit: state.maxLimit,
      };
    case "DECREMENT":
      return {
        quantity: Math.max(state.quantity - 10000, state.minLimit),
        maxLimit: state.maxLimit,
      };
    case "SET":
      return {
        quantity: Math.max(
          state.minLimit,
          Math.min(Math.floor(action.payload / 10000) * 10000, state.maxLimit)
        ),
        maxLimit: state.maxLimit,
      };
    case "UPDATE_MAX":
      return {
        quantity: state.quantity, // Don't change quantity unless needed
        maxLimit: Math.max(action.payload, state.minLimit), // Ensure it's at least the min limit
      };
    default:
      return state;
  }
}

function HandleQuantity({ currentPrice, onQuantityChange }) {
  const initialPrice = currentPrice || 10000; // Default to 10,000 if not set

  const [state, dispatch] = useReducer(quantityReducer, {
    quantity: initialPrice,
    minLimit: initialPrice, // ✅ Ensure minimum bid is the current bid
    maxLimit: initialPrice + Math.floor(initialPrice * 0.1), // ✅ Max limit is 10% above current bid
  });

  useEffect(() => {
    onQuantityChange(state.quantity); // ✅ Notify parent of changes
  }, [state.quantity, onQuantityChange]);

  useEffect(() => {
    if (currentPrice !== state.minLimit) {
      dispatch({ type: "UPDATE_MAX", payload: currentPrice + Math.floor(currentPrice * 0.1) });
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
    </div>
  );
}

export default HandleQuantity;
