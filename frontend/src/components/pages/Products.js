import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Product from './Product';
import MetaData from '../layout/MetaData';
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../redux/features/productSlice";
import Loader from '../partials/Loader';
import toast from 'react-hot-toast';
import Search from '../partials/Search';
import Pagination from 'react-js-pagination';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Alert from 'react-bootstrap/Alert';
import { FaRupeeSign } from 'react-icons/fa';
import { CATEGORIES } from '../data/constants';
const Products = () => {
    const { products, productCount, loading, error, productDefaultImage, resultPerPage, filteredProductsCount } = useSelector(state => state.products);
    const dispatch = useDispatch();
    const { keyword } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [rating, setRating] = useState();
    const [category, setCategory] = useState("");

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    }

    useEffect(() => {
        if (error) {
            return toast.error(error)
        }
        let params = {};
        if (keyword) {
            params.keyword = keyword.trim();
        }
        if (currentPage) {
            params.page = currentPage;
        }
        if (price) {
            params.price = {};
            params.price["gte"] = price[0];
            params.price["lte"] = price[1];
        }
        if(category){
            params.category = category;
        }
        if(rating){
            params.ratings = rating;
        }
        dispatch(getAllProduct(params))
    }, [dispatch, error, keyword, currentPage, price, category, rating]);

    const setCurrentPageNo = (pageNumber) => {
        setCurrentPage(pageNumber);
    }
    const ratingHandler = (event, rating) => {
        setRating(rating);
    }
    let count = filteredProductsCount; 
    return (
        <>
            <MetaData title="Shop for All products" />
            {loading ? <Loader /> :
                <div className="product-section productListPage">
                    <div className="container">
                        <Search searchVal={keyword} />
                        <div className="row">
                            <div className="col-lg-2 col-md-12">
                                <div className="border-bottom mb-4 pb-4">
                                    <Typography component={'span'} variant={'body2'}>Filter by price</Typography>
                                    <Slider
                                        value={price}
                                        valueLabelDisplay="auto"
                                        step={10}
                                        marks
                                        min={0}
                                        max={25000}
                                        onChange={priceHandler}
                                        getAriaValueText={value=> `Price ${<FaRupeeSign /> + value} Rupees`}
                                    />
                                </div>
                                <div className="border-bottom mb-4 pb-4">
                                    <Typography component={'span'} variant={'body2'}>Categories</Typography>
                                    <ul className="list-group list-group-flush">
                                        {
                                            CATEGORIES.map((category, key) => (
                                                <li key={"category" + key} className="list-group-item list-group-item-action" onClick={()=>setCategory(category)}>{category}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className="border-bottom mb-4 pb-4">
                                    <Typography component={'span'} variant={'body2'}>Filter By Ratings</Typography>
                                    <ul className="list-group list-group-flush">
                                    <Slider
                                        value={rating}
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={0}
                                        max={5}
                                        onChange={ratingHandler}
                                        getAriaValueText={value=> `${value}`}
                                    />
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-10 col-md-12">
                                <div className='row'>
                                    {products.length > 0 ? products.map(product => (
                                        <Product key={product._id} product={product} productDefaultImage={productDefaultImage} />
                                    )) : <Alert style={{width:"50vh", margin:"0  auto"}} key={"info"} variant={"info"}>No Products found!</Alert>}

                                    {resultPerPage < count &&
                                        <Pagination
                                            activePage={currentPage}
                                            itemsCountPerPage={resultPerPage}
                                            totalItemsCount={productCount}
                                            onChange={setCurrentPageNo}
                                            itemClass='page-item'
                                            linkClass='page-link'
                                            activeClass='pageItemActive active'
                                            activeLinkClass='pageLinkActive active'
                                        />
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            }

        </>
    )
}

export default Products;