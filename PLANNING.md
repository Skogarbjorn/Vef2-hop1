## Routes

/ 
  GET               ***

/profa 
  GET               ***
  POST(admin)       ***

/profa/:id 
  GET(admin)        ***
  POST              ***
  DELETE(admin)     ***
  PATCH(admin)

/namskeid 
  GET               ***
  POST(admin)       ***

/namskeid/:id 
  GET               ***
  POST              ***
  DELETE(admin)     ***
  PATCH(admin)

/laera 
  GET               ***
  POST(admin)       TODO-add to image/video service

/laera/:id 
  GET               ***
  DELETE(admin)
  PATCH(admin)

/users 
  GET(admin)        ***

/users/me 
  GET               ***
  DELETE            ***

/users/:id 
  GET(admin)        ***
  DELETE(admin)     ***

/users/login
  POST              ***

/users/register 
  POST              ***

## Database tables

users

practiceList
practiceSignups

courseList
courseSignups

attacks
