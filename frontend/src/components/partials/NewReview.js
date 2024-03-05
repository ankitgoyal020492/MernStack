import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux'; import toast from 'react-hot-toast';
import { useNewReviewMutation } from '../../redux/api/productApi';
import StarRatings from 'react-star-ratings';
const NewReview = (props) => {
    const dispatch = useDispatch();
    const [newReview, { isLoading, isError, error: reviewError, isSuccess }] = useNewReviewMutation();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const addNewReview = async (e) => {
        e.preventDefault();
        await newReview({rating, comment, productId:props.productId});
    }
    useEffect(() => {
        if (isError) {
            toast.dismiss();
            toast.error(reviewError.data.error);
        }
        if (isSuccess === true && isLoading === false) {
            toast.dismiss();
            toast.success("Review added successfully.");
            props.getProductDetail();
            props.handleClose();
        }
    }, [isError, isLoading, isSuccess, dispatch, props, reviewError]);
    return (
        <>
            <Modal show={props.showModal}
                onHide={props.handleClose}
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form method='post' onSubmit={addNewReview}>

                        <div className="form-outline mb-4">
                            <StarRatings
                                rating={rating}
                                starRatedColor="#f9bf29"
                                starHoverColor="#f9bf29"
                                changeRating={setRating}
                                numberOfStars={5}
                                name='rating'
                                starDimension="20px"
                            />
                            <label className="form-label" htmlFor="rating">Rating</label>
                        </div>
                        <div className="form-outline mb-4">
                            <textarea id="comment" name="comment" value={comment} onChange={(e) => setComment(e.target.value)} className="form-control" >{comment}</textarea>
                            <label className="form-label" htmlFor="comment">Comment</label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mb-3">Update</button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default NewReview