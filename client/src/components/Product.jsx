import React from "react";
import StripeCheckout from "react-stripe-checkout";
import headphoneImg from "../assets/headphone.png";
import "./Product.css";

const STRIPE_KEY = process.env.REACT_APP_STRIPE;

const PRODUCT = {
  name: "Wireless Headphones",
  img: headphoneImg,
  price: 40.99,
  company: "Phillips",
};

const Product = () => {
  const price = PRODUCT.price.toString().split(".");

  const makePayment = (token) => {
    const body = {
      token,
      PRODUCT,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    return fetch("http://localhost:5000/payment", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((res) => {
        console.log(res);
        const { status } = res;
        console.log(status);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="card">
      <div className="img-box">
        <img src={PRODUCT.img} alt="" />
      </div>
      <div className="content-box">
        <h3>{PRODUCT.name}</h3>
        <h4 className="price">
          $ {price[0]}.<small>{price[1]}</small>
        </h4>
        <StripeCheckout
          stripeKey={STRIPE_KEY}
          token={makePayment}
          name="Surya Shop"
          amount={PRODUCT.price * 100}
          shippingAddress
          billingAddress
        >
          <button className="buy-btn">Buy Now</button>
        </StripeCheckout>
      </div>
    </div>
  );
};

export default Product;
