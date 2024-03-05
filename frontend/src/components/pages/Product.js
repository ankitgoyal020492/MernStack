import React from 'react'
import { FaPlus, FaRupeeSign } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

const Product = ({ product, productDefaultImage }) => {
    const imgError = (e) => {
        e.target.onerror = null;
        e.target.src = productDefaultImage;
    }
    return (
        <div className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
            <Link className="product-item" to={`/product/${product._id}`}>
                <img alt={product.name} src={product?.images[0]?.url} className="img-fluid product-thumbnail" 
                onError={(err) =>imgError(err)}
                />
                <h3 className="product-title">{product.name}</h3>
                <strong className="product-price"><FaRupeeSign />{product.price}</strong>
                <br />
                <span>
                    <StarRatings
                        rating={product.ratings}
                        starRatedColor="#f9bf29"
                        changeRating={null}
                        numberOfStars={5}
                        name='rating'
                        starDimension="20px"
                    />
                    <br />
                    <span>({product.numOfReview}) reviews</span>
                </span>
                <span className="icon-cross">
                    <FaPlus style={{ color: "#fff" }} className="img-fluid" />
                </span>
            </Link>
        </div>
    )
}

export default Product