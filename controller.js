const {
  displayCategories,
  displayReviews,
  displayReviewId,
  displayCommentByReviewId,
  insertComment,
  updateReview,
} = require("./model");

const getCategories = (request, response) => {
  displayCategories().then((categoriesObject) => {
    const categories = categoriesObject.rows;
    response.status(200).send(categories);
  });
};

const getReviews = (request, response) => {
  displayReviews().then((reviews) => {
    const reviewData = reviews.rows;
    response.status(200).send(reviewData);
  });
};

const getReviewsById = (request, response) => {
  const { review_id } = request.params;
  displayReviewId(review_id).then((reviewById) => {
    const reviewByIdToSend = reviewById.rows;
    response.status(200).send(reviewByIdToSend);
  });
};

const getCommentByReviewId = (request, response) => {
  const { review_id } = request.params;
  displayCommentByReviewId(review_id).then((commentToSend) => {
    response.status(200).send(commentToSend.rows);
  });
};

const postComment = (request, response, next) => {
  const { review_id } = request.params;
  const { username, body } = request.body;

  insertComment(review_id, { username, body })
    .then((commentToSend) => {
      response.status(201).send(commentToSend);
    })
    .catch(next);
};

const patchReviewById = (request, response, next) => {
  const { review_id } = request.params;
  const { inc_votes } = request.body;
  updateReview(inc_votes, review_id)
    .then((updatedReview) => {
      response.status(200).send(updatedReview);
    })
    .catch(next);
};

module.exports = {
  getCategories,
  getReviewsById,
  getReviews,
  getCommentByReviewId,
  postComment,
  patchReviewById,
};
