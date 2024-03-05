import React from 'react'
import StarRatings from 'react-star-ratings'
import Card from 'react-bootstrap/Card';
import { FaUserAstronaut } from 'react-icons/fa';
import moment from 'moment';
import Col from 'react-bootstrap/Col';
const ReviewCard = ({ review }) => {
    return (
        <Col key={review.id+"reCol"}>
        <Card>
            <Card.Body>
                <Card.Title>
                    <StarRatings
                        rating={review.rating}
                        starRatedColor="#f9bf29"
                        changeRating={null}
                        numberOfStars={5}
                        name='rating'
                        starDimension="20px"
                    />
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{review.name}</Card.Subtitle>
                <Card.Text>
                    {review.comment}
                </Card.Text>
                <Card.Footer>
                <FaUserAstronaut /><small className="text-muted"> {moment(review.createdAt).fromNow()
}</small>
                </Card.Footer>
            </Card.Body>
        </Card>
        </Col>
    )
}

export default ReviewCard;