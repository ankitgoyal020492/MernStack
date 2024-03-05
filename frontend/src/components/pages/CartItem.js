import React from 'react'
import { FaMinus, FaPlus, FaRupeeSign, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CartItem = (props) => {
    const { product, productDefaultImage } = props;
    return (
        <tr>
            <td className="align-middle">
                <img src={product.images?.[0]} alt="" style={{ width: "50px" }} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = productDefaultImage
                }} />
                <Link className="product-item" to={`/product/${product.productId}`}>
                    {product.name}</Link> </td>
            <td className="align-middle"><FaRupeeSign />{product.price}</td>
            <td className="align-middle">
                <div className="input-group quantity mx-auto" style={{ width: "100px" }}>
                    <div className="input-group-btn">
                        <button className="btn btn-sm btn-white btn-minus" onClick={()=>props.decreaseCartItemQuantity(product)}>
                            <FaMinus />
                        </button>
                    </div>
                    <input type="text" className="form-control form-control-sm text-center input-sm" id="inputsm" value={product.quantity} />
                    <div className="input-group-btn">
                        <button className="btn btn-sm btn-white  btn-plus" onClick={()=>props.increaseCartItemQuantity(product)}>
                            <FaPlus />
                        </button>
                    </div>
                </div>
            </td>
            <td className="align-middle"><FaRupeeSign />{product.price*product.quantity}</td>
            <td className="align-middle"><button className="btn btn-lg" onClick={()=>props.removeCartItemHandler(product.productId)}><FaTimesCircle /></button></td>
        </tr>
    )
}

export default CartItem