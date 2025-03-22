"use client";
import React, { useReducer, useEffect } from "react";

// Reducer function to manage quantity state
function quantityReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        quantity: Math.min(state.quantity + 10000, state.maxLimit), // Ensure max limit
      };
    case "DECREMENT":
      return {
        quantity: Math.max(state.quantity - 10000, state.minLimit), // Ensure min limit (currentPrice)
      };
    case "SET":
      return {
        quantity:
          action.payload >= state.minLimit
            ? Math.min(action.payload, state.maxLimit)
            : state.minLimit, // Restrict between `currentPrice` and `maxLimit`
      };
    case "UPDATE_LIMITS":
      return {
        ...state,
        minLimit: action.payload.minLimit,
        maxLimit: action.payload.maxLimit,
        quantity: Math.max(state.quantity, action.payload.minLimit), // Adjust quantity if needed
      };
    default:
      return state;
  }
}

function HandleQuantity({ currentPrice, onQuantityChange }) {
  const minLimit = currentPrice || 10000;
  const maxLimit = currentPrice + currentPrice * 0.1;

  const [state, dispatch] = useReducer(quantityReducer, {
    quantity: minLimit,
    minLimit,
    maxLimit,
  });

  useEffect(() => {
    onQuantityChange(state.quantity);
  }, [state.quantity, onQuantityChange]);

  useEffect(() => {
    dispatch({
      type: "UPDATE_LIMITS",
      payload: { minLimit, maxLimit },
    });
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
      <a
        className="quantity__minus"
        style={{ cursor: "pointer" }}
        onClick={decrement}
      >
        <i className="bx bx-minus" />
      </a>
      <input
        name="quantity"
        type="text"
        value={state.quantity}
        onChange={handleInputChange}
        className="quantity__input"
        placeholder={minLimit}
      />
      <a
        className="quantity__plus"
        style={{ cursor: "pointer" }}
        onClick={increment}
      >
        <i className="bx bx-plus" />
      </a>
    </div>
  );
}

export default HandleQuantity;
