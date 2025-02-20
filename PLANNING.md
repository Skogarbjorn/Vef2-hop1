## Routes

/ 
  GET

/profa 
  GET               ***
  POST(admin)       ***

/profa/:id 
  GET               ***
  POST              ***
  DELETE(admin)

/namskeid 
  GET 
  POST(admin)

/namskeid/:id 
  POST 
  DELETE(admin)

/laera 
  GET 
  POST(admin)

/laera/:id 
  GET 

/users 
  GET(admin)        ***

/users/me 
  GET               ***
  DELETE            ***
  PATCH

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
