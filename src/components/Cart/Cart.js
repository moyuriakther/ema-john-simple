import React from 'react';

const Cart = (props) => {
    const cart = props.cart;
    // console.log(cart);
    const total = cart.reduce((total, product) => total + product.price * product.quantity, 0);    
    // let total = 0;
    // for (let i = 0; i < cart.length; i++) {
    //     const product = cart[i];
    //     total = total + product.price * product.quantity;
    // }
    let shipping = 0;
    if(total > 35){
        shipping = 0;
    }
    else if(total > 15){
       shipping = 4.99;
    }
    else if(total > 0){
        shipping = 12.99;
    }
    const tax =(total / 10).toFixed(2);
    const grandTotal = (total + shipping + Number(tax)).toFixed(2);
    const formatNumber = (num) =>{
        const precision =num.toFixed(2);
        return Number(precision);
    }

    return (
        <div>
            <h4 className="text-warning">Order Summary</h4>
            <h5>Items Orderd : {cart.length}</h5>
            <h5>Product Price:{formatNumber(total)}</h5>
            <h5><small>Shipping Cost : {shipping}</small></h5>
            <h5><small>Tax + Vat : {tax}</small></h5>
            <h5>Total Price : {grandTotal}</h5> <br/>
            { 
                props.children
            }
        </div>
    );
};

export default Cart;