import React from 'react'
import { useOrderDetailsQuery } from '../../redux/api/orderApi'
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../partials/Loader';
import { FaReply, FaRupeeSign } from 'react-icons/fa';

const OrderDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { isLoading, data, isError, error } = useOrderDetailsQuery(params.id);
    if (isError) {
        const err = error;
        toast.error(err.data.error);
    }
    return (
        <>
            {isLoading === true ? <Loader /> :
                <div>
                    <div className="content container my-5">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                        <h4 className="page-title">Order Details
                                        <button className='btn btn-outline-primary float-end' onClick={() => navigate(-1)}><FaReply className='mr-1'/> Back</button>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-lg-7 col-md-10 col-sm-11">

                                    <div className="horizontal-steps mt-4 mb-4 pb-5" id="tooltip-container">
                                        <div className="horizontal-steps-content">
                                            <div className={"step-item " + (data?.order?.orderStatus === "Processing" ? "current" : "")}>
                                                <span data-bs-container="#tooltip-container" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-original-title="">Order Placed</span>
                                            </div>
                                            <div className={"step-item " + (data?.order?.orderStatus === "Shipped" ? "current" : "")}>
                                                <span>Shipped</span>
                                            </div>
                                            <div className={"step-item " + (data?.order?.orderStatus === "Delivered" ? "current" : "")}>
                                                <span>Delivered</span>
                                            </div>
                                        </div>

                                        <div className="process-line" style={{ width: data?.order?.orderStatus === "Processing" ? 0 : (data?.order?.orderStatus === "Shipped" ? "50%" : "100%") }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="header-title mb-3">Items</h4>

                                            <div className="table-responsive">
                                                <table className="table mb-0">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Item</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data?.order?.orderItems?.map((item, i) => (
                                                            <tr key={i}>
                                                                <td>{item.name}</td>
                                                                <td>{item.quantity}</td>
                                                                <td><FaRupeeSign /> {item.price}</td>
                                                                <td><FaRupeeSign /> {item.quantity * item.price}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="header-title mb-3">Order Summary</h4>

                                            <div className="table-responsive">
                                                <table className="table mb-0">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Description</th>
                                                            <th>Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Grand Total :</td>
                                                            <td><FaRupeeSign /> {data?.order?.itemsPrice}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Shipping Charge :</td>
                                                            <td><FaRupeeSign /> {data?.order?.shippingPrice}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Estimated Tax : </td>
                                                            <td><FaRupeeSign /> {data?.order?.taxPrice}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Total :</th>
                                                            <th><FaRupeeSign /> {data?.order?.totalPrice}</th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="header-title mb-3">Shipping Information</h4>

                                            <h5>{data?.order?.shippingInfo?.name}</h5>

                                            <address className="mb-0 font-14 address-lg">
                                                {data?.order?.shippingInfo?.address} {data?.order?.shippingInfo?.city}<br />
                                                {data?.order?.shippingInfo?.state}, {data?.order?.shippingInfo?.country} {data?.order?.shippingInfo?.pinCode}<br />
                                                <abbr title="Phone">P:</abbr> {data?.order?.shippingInfo?.phoneNo}
                                            </address>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="header-title mb-3">Payment Information</h4>

                                            <h5>#{data?.order?.paymentInfo?.id}</h5>

                                            <p className='mb-1'>{data?.order?.paymentInfo?.status}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="header-title mb-3">Delivery Info</h4>

                                            <div className="text-center">
                                                <i className="mdi mdi-truck-fast h2 text-muted"></i>
                                                <h5><b>UPS Delivery</b></h5>
                                                <p className="mb-1"><b>Order ID :</b> {data?.order?._id}</p>
                                                <p className="mb-0"><b>Payment Mode :</b> Card</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>
                </div >

            }

        </>
    )
}

export default OrderDetail