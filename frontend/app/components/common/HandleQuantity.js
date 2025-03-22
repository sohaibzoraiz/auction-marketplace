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
        return { ...state, quantity: state.minLimit, showMinLimitMessage: true };
      }
      if (newValue > state.maxLimit) {
        return { ...state, quantity: state.maxLimit, showMaxLimitMessage: true };
      }
      return { ...state, quantity: newValue, showMaxLimitMessage: false, showMinLimitMessage: false };
    }

    case "UPDATE_LIMITS": {
      const newMinLimit = Math.floor(action.payload);
      const newMaxLimit = newMinLimit + Math.floor(newMinLimit * 0.1);
      return {
        ...state,
        quantity: newMinLimit > state.maxLimit ? newMinLimit : state.quantity,
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
    quantity: Math.floor(currentPrice),
    minLimit: Math.floor(currentPrice),
    maxLimit: Math.floor(currentPrice + currentPrice * 0.1),
    showMaxLimitMessage: false,
    showMinLimitMessage: false,
  });

  // ✅ Update parent component when quantity changes
  useEffect(() => {
    if (state.quantity !== "") {
      onQuantityChange(state.quantity);
    }
  }, [state.quantity, onQuantityChange]);

  // ✅ Update limits ONLY IF `lastBidFromDB` changes
  useEffect(() => {
    if (lastBidFromDB && Math.floor(lastBidFromDB) !== state.minLimit) {
      dispatch({ type: "UPDATE_LIMITS", payload: lastBidFromDB });
    }
  }, [lastBidFromDB]);

  const increment = () => dispatch({ type: "INCREMENT" });
  const decrement = () => dispatch({ type: "DECREMENT" });

  const [inputValue, setInputValue] = useState(state.quantity.toString());

  // ✅ Allow typing normally, don't force update immediately
  const handleInputChange = (e) => {
    let newValue = e.target.value.replace(/\D/g, ""); // ✅ Only allow numbers
    setInputValue(newValue); // ✅ Temporary update for user experience
  };

  // ✅ Only update state when user leaves input field
  const handleBlur = () => {
    let finalValue = inputValue === "" ? state.minLimit : parseInt(inputValue, 10);
    dispatch({ type: "SET", payload: finalValue });
    setInputValue(finalValue.toString()); // ✅ Ensure valid input after blur
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
        onChange={handleInputChange}
        onBlur={handleBlur} // ✅ Validate & apply limits when user finishes typing
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
