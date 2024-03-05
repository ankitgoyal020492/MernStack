import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { getProductDetail, setLoadingState } from '../../redux/features/productSlice';
import Loader from '../partials/Loader';
import { CATEGORIES } from '../data/constants';
import { FaTimes } from 'react-icons/fa';
import { useAddProductMutation, useEditProductMutation } from '../../redux/api/adminProductApi';
import toast from 'react-hot-toast';
const ProductForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const [addProduct, { isLoading, isError, error, isSuccess }] = useAddProductMutation();
    const [editProduct, { isLoading: editIsLoading, isError: editIsError, error: editError, isSuccess: editIsSuccess }] = useEditProductMutation();
    const [productDetail, setProductDetail] = useState({
        name: '',
        price: '',
        description: '',
        images: [],
        category: '',
        stock: ''
    });
    const [oldImages, setOldImages] = useState([]);
    const [removedOldImages, setRemovedOldImages] = useState([]);
    const { product, loading } = useSelector(state => state.products);
    useEffect(() => {
        if (params.id) {
            dispatch(getProductDetail(params.id));
            if (product) {
                setProductDetail({
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    images: [],
                    category: product.category,
                    stock: product.stock
                });
                setOldImages(product.images);
            }
        } else {
            dispatch(setLoadingState(false));
        }
    }, [params.id, product._id, dispatch])
    useEffect(() => {
        if (isError) {
            toast.error(error.data.error);
        }
        if (isSuccess) {
            toast.success('Product Added');
            navigate('/admin/products');
        }
        if (editIsError) {
            toast.error(editError.data.error);
        }
        if (editIsSuccess) {
            toast.success('Product Updated');
            navigate('/admin/products');
        }
    }, [isError, error, isSuccess, navigate, editIsError, editIsSuccess])

    const onChangeHandler = (e) => {
        setProductDetail({
            ...productDetail,
            [e.target.name]: e.target.value
        });
    }
    const imageSelector = (e) => {
        setProductDetail({
            ...productDetail,
            images: [...productDetail.images, ...e.target.files]
        })
    }
    const removeImage = (key) => {
        const pImg = productDetail.images.filter((image, keyImg) => key !== keyImg);
        setProductDetail({
            ...productDetail,
            images: pImg
        });
    }
    const submitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', productDetail.name);
        formData.append('price', productDetail.price);
        formData.append('description', productDetail.description);
        formData.append('category', productDetail.category);
        formData.append('stock', productDetail.stock);
        [...productDetail.images].forEach((file, i) => {
            formData.append(`images`, file, file.name)
        });
        if (params.id) {
            formData.append('oldImages', JSON.stringify(oldImages));
            formData.append('removedOldImages', JSON.stringify(removedOldImages));
            await editProduct({ id: params.id, formData });
        } else {
            await addProduct(formData);
        }
    }
    const removeOldImage = (public_id) => {
        const pImg = oldImages.filter((image) => image.public_id !== public_id);
        setOldImages(pImg);
        setRemovedOldImages([...removedOldImages, public_id]);
    }
    return (
        <div>
            {loading || isLoading || editIsLoading ? <Loader /> : <>
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-md-12">
                            <h3 className="display-6">Product {params.id ? "Update" : "Add"}</h3>
                            <div className="card">

                                <div className="card-body">
                                    <form method='post' encType='multipart/form-data' onSubmit={(e) => submitForm(e)}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Name</label>
                                                    <input type="text" className="form-control" value={productDetail.name} name='name' onChange={(e) => onChangeHandler(e)} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Price</label>
                                                    <input type="text" className="form-control" value={productDetail.price} name='price' onChange={(e) => onChangeHandler(e)} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Stock</label>
                                                    <input type="number" className="form-control" value={productDetail.stock} name='stock' onChange={(e) => onChangeHandler(e)} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Description</label>
                                                    <textarea className='form-control' value={productDetail.description} name='description' onChange={(e) => onChangeHandler(e)}>{productDetail.description}</textarea>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Category</label>
                                                    <select className='form-control' value={productDetail.category} name='category' onChange={(e) => onChangeHandler(e)}>
                                                        <option value={""}>--Select Category--</option>
                                                        {
                                                            CATEGORIES.map((categoryData, key) => (
                                                                <option key={"category" + key} value={categoryData}>{categoryData}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Images</label>
                                                    <input type="file" className="form-control" multiple onChange={(e) => imageSelector(e)} />
                                                </div>
                                            </div>
                                            {oldImages?.length > 0 &&
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Images</label><br />
                                                        {
                                                            oldImages.map((image, key) => (
                                                                <div className='w-25 d-inline-block position-relative m-2'>
                                                                    <img key={"image" + key} src={image.url} className="thumb_image img-fluid img-thumbnail" alt={"imageold" + key} />
                                                                    <span onClick={() => removeOldImage(image.public_id)} className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger border border-light">
                                                                        <FaTimes />
                                                                    </span>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            {productDetail?.images?.length > 0 &&
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Images</label><br />
                                                        {
                                                            productDetail.images.map((image, key) => (
                                                                <div className='w-25 d-inline-block position-relative m-2'>
                                                                    <img key={"image" + key} src={URL.createObjectURL(image)} className="thumb_image img-fluid img-thumbnail" alt={"image" + key} />
                                                                    <span onClick={() => removeImage(key)} className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger border border-light">
                                                                        <FaTimes />
                                                                    </span>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div><button type='submit'>Submit</button></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
        </div>
    )
}

export default ProductForm