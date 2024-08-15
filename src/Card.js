import React, { useState } from 'react';
import './Card.css';

const Card = ({ card, updateCard, deleteCard, connectCards }) => {
  const [showMore, setShowMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(card.text);
  const [targetCardNumber, setTargetCardNumber] = useState('');

  const handleEdit = () => {
    updateCard(card.id, { text: editedText });
    setIsEditing(false);
  };

  const handleConnect = () => {
    connectCards(card.id, targetCardNumber);
    setTargetCardNumber('');
  };

  return (
    <div className="card">
      {isEditing ? (
        <div>
          <textarea value={editedText} onChange={e => setEditedText(e.target.value)} />
          <button className="save-button" onClick={handleEdit}>
            Save
          </button>
        </div>
      ) : (
        <p className="card-text">
          {showMore ? card.text : `${card.text.substring(0, 50)}...`}
          <button className="show-more-button" onClick={() => setShowMore(!showMore)}>
            {showMore ? 'Show Less' : 'Show More'}
          </button>
        </p>
      )}

      <button className="edit-button" onClick={() => setIsEditing(true)}>
        Edit
      </button>
      <button className="delete-button" onClick={() => deleteCard(card.id)}>
        Delete
      </button>

      <div className="connect-container">
        <input
          type="number"
          placeholder="Connect to card #"
          value={targetCardNumber}
          onChange={e => setTargetCardNumber(e.target.value)}
        />
        <button className="connect-button" onClick={handleConnect}>
          Connect
        </button>
      </div>

      {showMore && (
        <div className="card-popup">
          <h3>Card Details</h3>
          <p>{card.text}</p>
          <button className="close-popup-button" onClick={() => setShowMore(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
