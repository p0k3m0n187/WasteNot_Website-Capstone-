// Popup.js
import React from "react";
import './Design/popup.css'; // Create a separate CSS file for styling your popup

const Popup = ({ onClose, dishName, dishDescription, dishCategory, ingredientsList, dishImage }) => {
  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>{dishName}</h2>
        <img src={dishImage} alt={dishName} className="dish-image" />
        <p><strong>Description:</strong> {dishDescription}</p>
        <p><strong>Category:</strong> {dishCategory}</p>
        <p><strong>Ingredients:</strong> 
          {ingredientsList && Array.isArray(ingredientsList) ? (
            <ul>
              {ingredientsList.map((ingredient, index) => (
                <li key={index}>{`${ingredient.ingredient} (${ingredient.grams} grams)`}</li>
              ))}
            </ul>
          ) : (
            <p>No ingredients available.</p>
          )}
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
