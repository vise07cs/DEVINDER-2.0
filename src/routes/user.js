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
    }).select("-password -__v -createdAt -updatedAt"); // exclude password and __v field from the result


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

module.exports = { userRouter };
