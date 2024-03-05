import React, { useEffect, useState } from 'react';
import MetaData from '../layout/MetaData';
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct, getProductDetail } from "../../redux/features/productSlice";
import Loader from '../partials/Loader';
import toast from 'react-hot-toast';
import Carousel from 'react-bootstrap/Carousel';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { FaMinus, FaPlus, FaRupeeSign, FaShoppingBasket } from 'react-icons/fa';
import ReviewCard from '../partials/ReviewCard';
import Row from 'react-bootstrap/Row';
import { addToCart } from '../../redux/features/product/cartSlice';
import NewReview from '../partials/NewReview';

const ProductDetail = (props) => {
    const { id } = useParams();
    const { products, product, loading, error, productDefaultImage } = useSelector(state => state.products);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [reviewModal, setReviewModal] = useState(false);

    useEffect(() => {
        if (error) {
            return () => { toast.error(error) }
        }
        dispatch(getProductDetail(id));
        dispatch(getAllProduct({ resultPerPage: 3 }));
    }, [dispatch, id, error]);
    const defaultImageSet = (e) => {
        e.target.onerror = null;
        e.target.src = productDefaultImage;
    }
    const increaseQuantity = (e) => {
        let qty = quantity + 1;
        if (qty > product.stock) {
            toast.error("You can't add more than " + quantity);
            return;
        }
        setQuantity(qty);
    }
    const decreaseQuantity = (e) => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }

    }
    const addItemsToCart = () => {
        dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, stock: product.stock, images: product.images, quantity: quantity }));
        toast.dismiss();
        toast.success("Item added to cart");
    }
    const buyNow = () => {
        dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, stock: product.stock, images: product.images, quantity: quantity }));
        navigate("/user/checkout");
    }
    return (
        <>
            {loading ? <Loader /> :
                <>
                    <MetaData title={`Product Detail - ${product.name}`} />
                    <section className="py-5">
                        <div className="container">
                            <div className="row gx-5">
                                <aside className="col-lg-6">
                                    <Carousel>
                                        {product.images && product.images.map((item, i) => (
                                            <Carousel.Item key={i}>
                                                <img className="d-block w-100" src={item.url} alt={item.name} onError={(e) => defaultImageSet(e)} />
                                                <Carousel.Caption>
                                                    <h3>{item.name}</h3>
                                                    <p>{item.description}</p>
                                                </Carousel.Caption>
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                </aside>
                                <main className="col-lg-6">
                                    <div className="ps-lg-3">
                                        <h4 className="title text-dark">
                                            {product.name}
                                        </h4>
                                        <div className="d-flex flex-row my-3">
                                            <StarRatings
                                                rating={product.ratings}
                                                starRatedColor="#f9bf29"
                                                changeRating={null}
                                                numberOfStars={5}
                                                name='rating'
                                                starDimension="20px"
                                            />
                                            <span className="text-muted"><i className="fas fa-shopping-basket fa-sm mx-1"></i>{product.numOfReview} reviews</span>
                                            {
                                                product.stock > 0 ? <span className="text-success ms-2">In stock</span> : <span className="text-danger ms-2">Out of stock</span>
                                            }

                                        </div>

                                        <div className="mb-3">
                                            <span className="h5"><FaRupeeSign />{product.price}</span>
                                            {/* <span className="text-muted">/per box</span> */}
                                        </div>

                                        <p>
                                            {product.description}
                                        </p>

                                        <hr />
                                        {product.stock > 0 &&
                                            <>                                            <div className="row mb-4">
                                                <div className="col-md-4 col-6 mb-3">
                                                    <label className="mb-2 d-block">Quantity</label>
                                                    <div className="input-group mb-3" style={{ width: "170px" }}>
                                                        <button className="btn btn-white border border-secondary px-3" type="button" id="button-addon2" data-mdb-ripple-color="dark" onClick={() => decreaseQuantity()}>
                                                            <FaMinus />
                                                        </button>
                                                        <input type="text" className="form-control text-center border border-secondary" placeholder={quantity} aria-label="" aria-describedby="button-addon1" />

                                                        <button className="btn btn-white border border-secondary px-3" type="button" id="button-addon1" data-mdb-ripple-color="dark" onClick={() => increaseQuantity()}>
                                                            <FaPlus />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                                <button className="btn btn-warning shadow-0 me-3" onClick={() => buyNow()}> Buy now </button>
                                                <button className="btn btn-primary shadow-0" onClick={() => addItemsToCart()}> <FaShoppingBasket /> Add to cart </button>
                                            </>

                                        }
                                        {
                                            props.isAuthenticated === true &&
                                            <>
                                            <br />
                                            <br />
                                            <button className="btn btn-outline-success shadow-0" onClick={() => setReviewModal(true)}> Add Review </button>
                                            </>
                                        }
                                    </div>
                                </main>
                            </div>
                        </div>
                    </section>
                    <section className="bg-light border-top py-4">
                        <div className="container">
                            <div className="row gx-4">
                                <div className="col-lg-8 mb-4">
                                    <div className="border rounded-2 px-3 py-2 bg-white">

                                        <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                                            <li className="nav-item d-flex" role="presentation">
                                                <Link className="nav-link d-flex align-items-center justify-content-center w-100 active" id="ex1-tab-1" data-mdb-toggle="pill" to="#ex1-pills-1" role="tab" aria-controls="ex1-pills-1" aria-selected="true">Reviews</Link>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="ex1-content">
                                            <div className="tab-pane fade show active" id="ex1-pills-1" role="tabpanel" aria-labelledby="ex1-tab-1">
                                                <div>
                                                    <Row xs={1} md={3} className="g-3">
                                                        {
                                                            product.reviews ? product.reviews.map((review, key) => (
                                                                <ReviewCard key={`review${key}`} review={review} />
                                                            )) : "No Reviews Yet."
                                                        }

                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="px-0 border rounded-2 shadow-0">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title">Other Products</h5>
                                                {
                                                    products && products.map((product, key) => (
                                                        <div key={"similarProduct" + product._id} className="d-flex mb-3">
                                                            <Link to={`/product/${product._id}`} className="me-3">
                                                                <img alt={product.name} src={product?.images?.[0]?.url} style={{ minWidth: "96px", height: "96px" }} className="img-md img-thumbnail" onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = productDefaultImage;
                                                                }} />
                                                            </Link>
                                                            <div className="info">
                                                                <Link to={`/product/${product._id}`} className="nav-link mb-1">
                                                                    {product.name}
                                                                </Link>
                                                                <strong className="text-dark"> <FaRupeeSign />{product.price}</strong>
                                                            </div>
                                                        </div>

                                                    ))
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {reviewModal === true &&
                        <NewReview 
                        showModal={reviewModal} 
                        handleClose={() => setReviewModal(false)} 
                        getProductDetail={() => dispatch(getProductDetail(product._id))}  
                        productId ={product._id}/>
                    }
                </>
            }
        </>
    )
}

export default ProductDetail;