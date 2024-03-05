import {  useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader from "../partials/Loader";
import TableHOC from "./TableHOC";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAllProductsQuery, useDeleteProductMutation } from "../../redux/api/adminProductApi";
import Sidebar from "./Sidebar";

const column = [
    {
        Header: "ID",
        accessor: "_id",
    },
    {
        Header: "Name",
        accessor: "name",
    },
    {
        Header: "Price",
        accessor: "price",
    },
    {
        Header: "Ratings",
        accessor: "ratings",
    },
    {
        Header: "Category",
        accessor: "category",
    },
    {
        Header: "Stock",
        accessor: "stock",
    },
    {
        Header: "Reviews",
        accessor: "reviews",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const ProductListing = () => {
    const { isLoading, data, isError, error } = useAllProductsQuery();
    const [deleteProduct, { isLoading: deleteIsLoading, isError: deleteIsError, error: deleteError, isSuccess: deleteIsSuccess }] = useDeleteProductMutation();
    const [rows, setRows] = useState([]);

    if (isError) {
        const err = error;
        toast.error(err.data.error);
    }

    const deleteProductData = async (e, id) => {
        e.preventDefault();
        await deleteProduct({ id });
    }

    useEffect(() => {
        if (data)
            setRows(
                data.products.map((i) => ({
                    _id: i._id,
                    name: i.name,
                    price: i.price,
                    ratings: i.ratings,
                    category: i.category,
                    stock: i.stock,
                    reviews: <Link to={"/admin/product/reviews/" + i._id}>{i.numOfReview}</Link>,
                    action: <>
                        <Link to={"/admin/product/edit/" + i._id}><FaEdit /></Link>
                        <Link onClick={(e) => deleteProductData(e, i._id)}><FaTrash /></Link>                        
                    </>,
                }))
            );
    }, [data]);

    useEffect(() => {
        if (deleteIsError) {
            toast.error(deleteError.data.error);
        }
        if (deleteIsSuccess) {
            toast.success("Product deleted successfully");

        }
    }, [deleteIsError, deleteError, deleteIsSuccess]);

    const Table = TableHOC(
        column,
        rows,
        "dashboard-product-box",
        "Products",
        rows.length > 20
    )();
    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                    <Sidebar />
                </div>
                <div className="col py-3">
                    {isLoading || deleteIsLoading ? <Loader /> : Table}
                </div>
            </div>
        </div>
    );
};

export default ProductListing;