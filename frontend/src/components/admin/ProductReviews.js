import {  useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import Loader from "../partials/Loader";
import TableHOC from "./TableHOC";
import { FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { useDeleteReviewMutation, useProductReviewsQuery } from "../../redux/api/adminProductReviewsApi";
import StarRatings from "react-star-ratings";

const column = [
    {
        Header: "ID",
        accessor: "_id",
    },
    {
        Header: "Ratings",
        accessor: "ratings",
    },
    {
        Header: "Comment",
        accessor: "comment",
    },
    {
        Header: "User",
        accessor: "user",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const ProductReviews = () => {
    const params = useParams();
    const { isLoading, data, isError, error } = useProductReviewsQuery(params.id);
    const [deleteReview, { isLoading: deleteIsLoading, isError: deleteIsError, error: deleteError, isSuccess: deleteIsSuccess }] = useDeleteReviewMutation();
    const [rows, setRows] = useState([]);

    if (isError) {
        const err = error;
        toast.error(err.data.error);
    }

    const deleteReviewData = async (e, id) => {
        e.preventDefault();
        await deleteReview({id, productId: params.id});
    }

    useEffect(() => {
        if (data)
            setRows(
                data?.review?.map((i) => ({
                    _id: i._id,
                    ratings: <>
                        <StarRatings
                            rating={i.rating}
                            starRatedColor="#f9bf29"
                            changeRating={null}
                            numberOfStars={5}
                            name='rating'
                            starDimension="20px"
                        />
                    </>,
                    comment: i.comment,
                    user: i.user?.name,
                    action: <>
                        <Link onClick={(e) => deleteReviewData(e, i._id)}><FaTrash /></Link>
                    </>,
                }))
            );
    }, [data]);

    useEffect(() => {
        if (deleteIsError) {
            toast.error(deleteError.data.error);
        }
        if (deleteIsSuccess) {
            toast.success("Product Review deleted successfully");

        }
    }, [deleteIsError, deleteError, deleteIsSuccess]);

    const Table = TableHOC(
        column,
        rows,
        "dashboard-product-box",
        "Products Review",
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

export default ProductReviews;