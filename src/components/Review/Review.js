import React, { useEffect, useState } from 'react';
import fakeData from '../../fakeData';
import { getDatabaseCart, processOrder, removeFromDatabaseCart} from '../../utilities/databaseManager';
import ReviewItem from '../ReviewItem/ReviewItem';
import Cart from '../Cart/Cart';
import { Link, useHistory } from 'react-router-dom';
import happyImage from '../../images/giphy.gif';

const Review = () => {
    const [cart, setCart] = useState([]);
    const [placeOrder, setPlaceOrder] = useState(false);
    const history = useHistory();

    const handleProceedReview = () => {
        history.push("/shipment");
    }
    const removeProduct = (productKey) =>{
        console.log('remove product clicked', productKey);
        const newCart = cart.filter(product => product.key !== productKey);
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }

    useEffect(() => {
        // cart 
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);
        const cartProducts = productKeys.map(key =>{
            const product = fakeData.find(pd => pd.key === key);
            product.quantity = savedCart[key];
            return product;
        });
        setCart(cartProducts);
    }, [])
    let thankyou;
    if(placeOrder){
        thankyou = <img src={happyImage} alt="happy"></img>;
    }
    return (
        <div className ="twin-container">
            <div className ="products-container">
                {
                    cart.map(pd => <ReviewItem 
                    product={pd}
                    key = {pd.key}
                    removeProduct = {removeProduct}></ReviewItem>)
                }
                 {
                        thankyou
                    }
            </div>
            <div className ="cart-container">
                <Cart cart = {cart}>
                    <button onClick={handleProceedReview} className="add-cart-button">Proceed Review</button>
                </Cart>
            </div>
        </div>
    );
};

export default Review;