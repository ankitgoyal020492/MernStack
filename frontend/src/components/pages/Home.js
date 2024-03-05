import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import couchImage from '../../assets/images/couch.png'
import Product from './Product';
import MetaData from '../layout/MetaData';
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../redux/features/productSlice";
import Loader from '../partials/Loader';
import toast from 'react-hot-toast';
import Search from '../partials/Search';

const Home = () => {
    const { products, loading, error, productDefaultImage } = useSelector(state => state.products);
    const dispatch = useDispatch();
    useEffect(() => {
        if(error){
            return toast.error(error)
        }
        dispatch(getAllProduct({ resultPerPage: 7 }))
    }, [dispatch, error]);
    return (
        <>
            <MetaData title="ECOMMERCE" />
            <div className="hero">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-lg-5">
                            <div className="intro-excerpt">
                                <h1>Modern Interior <span className="d-block">Design Studio</span></h1>
                                <p className="mb-4">Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique.</p>
                                <p>
                                    <Link to="#" className="btn btn-secondary me-2">Shop Now</Link>
                                    <Link to="#" className="btn btn-white-outline">Explore</Link>
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="hero-img-wrap">
                                <img alt="img1" src={couchImage} className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading  ? <Loader /> :
                <div className="product-section">
                    <div className="container">
                        <Search />
                        <div className="row">
                            <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
                                <h2 className="mb-4 section-title">Crafted with excellent material.</h2>
                                <p className="mb-4">Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. </p>
                                <p><a href="shop.html" className="btn">Explore</a></p>
                            </div>
                            {products && products.map(product => (
                                <Product key={product._id} product={product} productDefaultImage={productDefaultImage} />
                            ))}


                        </div>
                    </div>
                </div>
            }

        </>
    )
}

export default Home