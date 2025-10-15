const express = require("express");
const { userAuth } = require("../../middlewares/auth");
const userRouter = express.Router();
const { ConnectionRequestModel } = require("../models/connectionRequest");
const User = require("../models/user");

// get all pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "email",
      "city",
      "age",
    ]);

    res.json({
      message: `You have ${connectionRequests.length} pending connection requests`,
      data: connectionRequests,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// accepted connection requests for the logged in user
userRouter.get("/user/requests/accepted", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", ["firstName", "lastName", "email", "city", "age"])
      .populate("toUserId", ["firstName", "lastName", "email", "city", "age"]);

    const data = connectionRequests.map((req) => {
      if (req.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return req.toUserId; // You sent the request → show receiver
      } else {
        return req.fromUserId; // You received the request → show sender
      }
    });

    res.json({
      message: `You have ${connectionRequests.length} accepted connection requests`,
      data: data,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// feed API to get all users except the logged in user and users who have already sent or received connection requests to/from the logged in user (similar to Tinder swipe feature or insta page)

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
    let limit = parseInt(req.query.limit) || 10; // default to 10 users per page if not provided
    if (limit > 50) limit = 50; // maximum limit of 50 users per page

    const skip = (page - 1) * limit;



    // get all users who have sent or received connection requests to/from the logged in user
    const usersWithConnectionRequests = await ConnectionRequestModel.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("toUserId fromUserId -_id");

    // extract user ids from the connection requests
    const hideUsersFromFeed = new Set();

    usersWithConnectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.toUserId.toString());
      hideUsersFromFeed.add(req.fromUserId.toString()); //add both toUserId and fromUserId to the set
    });

    const users = await User.find({

      $and: [
        {
          _id: { $ne: loggedInUser._id }
        }, // $ne operator to find users whose _id is not equal to the logged in user's _id

        {
          _id: { $nin: Array.from(hideUsersFromFeed) }, // $nin operator to find users whose _id is not in the array of user ids to be hidden from feed
        },
      ],
    }).select("-password -__v -createdAt -updatedAt") // exclude password and __v field from the result
    .skip(skip).limit(limit); // implement pagination using skip and limit


    res.json({
      message: `You have ${users.length} users in your feed`,
      data: users,
    });

    // res.json({
    //   message: `You have ${usersWithConnectionRequests.length} users with connection requests`,
    //   data: usersWithConnectionRequests,
    // });

  } catch (err) {
    return res.status(400).send(err.message);
  }
});


// pagination logic explanation:
// adding pagination to the feed API to get users in chunks of 10 similar to infinite scroll feature used in social media apps like Instagram, Facebook , Tinder etc

//  feed?page=1&limit=10 ==> page 1 with 10 users per page (1-10)
//  feed?page=2&limit=10 ==> page 2 with 10 users per page  (11-20)
// feed?page=3&limit=10 ==> page 3 with 10 users per page   (21-30)

// skip and limit are mongoose methods to implement pagination
// skip(0) & limit(10) ==> page 1 ---> skip 0 users and limit to 10 users


module.exports = { userRouter };
