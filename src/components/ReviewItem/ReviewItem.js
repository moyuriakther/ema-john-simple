import React from 'react';

const ReviewItem = (props) => {
    const {name, quantity, key, price} = props.product;
    const reviewStyle = {
        margin : '20px',
        paddingBottom : '10px',
        borderBottom : '1px solid Gray'
    }
    return (
        <div style = {reviewStyle} className = 'review-item'>
            <h6 className ="product-name">{name}</h6>
            <h6>Quantity: {quantity}</h6>
            <h6><small>${price}</small></h6>
            <button 
                className = "add-cart-button"
                onClick={() => props.removeProduct(key)}
            >Remove</button>
        </div>
    );
};

export default ReviewItem;