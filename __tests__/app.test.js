const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const { app } = require("../app");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  db.end();
});

describe("app ", () => {
  describe("/api/categories", () => {
    test("respond with a status of 200", () => {
      return request(app).get("/api/categories").expect(200);
    });
    test("respond with a status of 200 and display an array of category objects ", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((categories) => {
          expect(Array.isArray(categories.body)).toBe(true);
          expect(categories.body).toHaveLength(4);
        });
    });
    test("the object must contain slug and description properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((categories) => {
          categories.body.forEach((category) => {
            expect(category).toHaveProperty("slug", expect.any(String));
            expect(category).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
  describe("/api/reviews", () => {
    test("respond with a status of 200 and display an array of review objects sorted by date in descending order ", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((reviews) => {
          const dateOrderToTest = reviews.body.map((review) => {
            return review.created_at.split("T")[0];
          });

          expect(dateOrderToTest).toBeSorted({ descending: true });
        });
    });
    test("reviews is an array of object with a length of 13 ", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((reviews) => {
          expect(reviews.body).toHaveLength(13);
        });
    });
    test("each review must contain owner,title,review_id,category,review_img_url, created_at,votes,designer, and comment_count properties ", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((reviews) => {
          reviews.body.forEach((review) => {
            expect(review).toHaveProperty("owner", expect.any(String));
            expect(review).toHaveProperty("title", expect.any(String));
            expect(review).toHaveProperty("category", expect.any(String));
            expect(review).toHaveProperty("designer", expect.any(String));
            expect(review).toHaveProperty("review_img_url", expect.any(String));
            expect(review).toHaveProperty("created_at", expect.any(String));
            expect(review).toHaveProperty("votes", expect.any(Number));
            expect(review).toHaveProperty("comment_count");
          });
        });
    });
  });
  describe("/api/reviews/:review_id", () => {
    test("respond with a status of 200 and display a review object that match with ID endpoint", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then((review) => {
          expect(review.body[0].title).toBe(testData.reviewData[0].title);
          expect(review.body[0].owner).toBe(testData.reviewData[0].owner);
          //prettier-ignore
          expect(review.body[0].review_body).toBe(testData.reviewData[0].review_body);
          expect(review.body[0].designer).toBe(testData.reviewData[0].designer);
          expect(review.body[0].category).toBe(testData.reviewData[0].category);
          expect(review.body[0].votes).toBe(testData.reviewData[0].votes);
          //prettier-ignore
          expect(review.body[0].review_img_url).toBe(testData.reviewData[0].review_img_url);
        });
    });
    test("a review object must have, review_id,title,review_body,designer,review_img_url,votes,category,owner,created_at - property", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then((review) => {
          review.body.forEach((review) => {
            expect(review).toHaveProperty("review_id");
            expect(review).toHaveProperty("title");
            expect(review).toHaveProperty("category");
            expect(review).toHaveProperty("designer");
            expect(review).toHaveProperty("owner");
            expect(review).toHaveProperty("review_body");
            expect(review).toHaveProperty("review_img_url");
            expect(review).toHaveProperty("created_at");
            expect(review).toHaveProperty("votes");
          });
        });
    });
  });
});