List of Dev tinder APIs

# auth router

POST /signup
POST /login
POST/logout


# profile router

GET/profile/view
PATCH/profile/edit
PATCH/profile/password


# connection request router
POST  /request/send/interested/:userID
POST  /request/send/ignored/:userID
POST /request/review/accepted/:requestID
POST /request/review/rejected/:requestID


# user routers
GET user/connections
GET user/requests/received
GET users/feed --> loads the feed 


Status --> ignore / interested / accepted / rejected



 






