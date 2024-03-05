import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { calculatePrice, resetCart } from "../../redux/features/product/cartSlice";
import { FaRupeeSign } from "react-icons/fa";
import { useNewOrderMutation } from "../../redux/api/orderApi"
const CheckOutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);

    const {
        shippingInfo,
        cartItems,
        subtotal,
        tax,
        shippingCharges,
        total,
    } = useSelector(state => state.cart);
    useEffect(() => {
        dispatch(calculatePrice());
    }, [cartItems, dispatch]);


    const [isProcessing, setIsProcessing] = useState(false);

    const [newOrder] = useNewOrderMutation();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        setIsProcessing(true);

        const orderData = {
            shippingInfo,
            orderItems: cartItems,
            itemsPrice: subtotal,
            taxPrice: tax,
            shippingPrice: shippingCharges,
            totalPrice: total,
            user: user?._id,
        };

        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin },
            billing_details: {
                name: shippingInfo.name,
                email: user.email,
                phone: shippingInfo.phoneNo,
                address: {
                    line1: shippingInfo.address,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    postal_code:shippingInfo.pinCode,
                    country: shippingInfo.country,
                }
            },
            redirect: "if_required",
        });

        if (error) {
            setIsProcessing(false);
            return toast.error(error.message || "Something Went Wrong");
        }

        if (paymentIntent.status === "succeeded") {
            orderData.paymentInfo = {
                id: paymentIntent.id,
                status: paymentIntent.status,
            };
            await newOrder(orderData);
            sessionStorage.removeItem("shippingInfo");
            localStorage.removeItem("cartItems");
            dispatch(resetCart());
            toast.success("Order Placed");
            navigate("/user/orders");
        }
        setIsProcessing(false);
    };
    return (
        <div className="container">
            <h3 className="display-4 text-center">Payment</h3><hr /><br />
            <div className="checkout-container  d-flex align-items-center justify-content-center">
                <form onSubmit={submitHandler}>
                    <PaymentElement />
                    <div className="mt-4 text-center">
                        <button type="submit" disabled={isProcessing} className="btn btn-success ">
                            {isProcessing ? (
                                <>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Pay <FaRupeeSign /> {total}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

const Pay = () => {
    const location = useLocation();

    const { clientSecret, stripeApiKey } = location.state;
    if (!clientSecret) return <Navigate to={"/user/checkout"} />;
    const stripePromise = loadStripe(stripeApiKey);

    return (
        <Elements
            options={{
                clientSecret
            }}
            stripe={stripePromise}
        >
            <CheckOutForm
            />
        </Elements>
    );
};

export default Pay;