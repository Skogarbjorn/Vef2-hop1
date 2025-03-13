## Routes (ALL COMPLETE!!!)

/
GET              ***

/profa
GET              ***
POST(admin)      ***

/profa/:id
GET(admin)       ***
POST             ***
DELETE(admin)    ***
PATCH(admin)     ***

/namskeid
GET              ***
POST(admin)      ***

/namskeid/:id
GET              ***
POST             ***
DELETE(admin)    ***
PATCH(admin)     ***

/laera
GET              ***
POST(admin)      ***

/laera/:id
GET              ***
DELETE(admin)    ***
PATCH(admin)     ***

/users
GET(admin)       ***

/users/me
GET              ***
DELETE           ***

/users/:id
GET(admin)       ***
DELETE(admin)    ***

/users/login
POST             ***

/users/register
POST             ***

## Database tables

users

practiceList
practiceSignups

courseList
courseSignups

attacks

## TODO!

Í gagnagrunninn skal hlaða inn viðeigandi gögnum fyrir verkefnið, a.m.k. 50 færslur í heildina.

verifya að þetta gildir:
    Allar niðurstöður sem geta skilað mörgum færslum (fleiri en 10) skulu skila síðum.

Setja skal upp eslint fyrir JavaScript

Setja skal upp jest til að skrifa test. Skrifa skal test fyrir a.m.k.:

    fjóra endapunkta, þar sem
    a.m.k. einn krefst auðkenningar
    a.m.k. einn tekur við gögnum

Í README skal tiltaka hvernig test eru keyrð.

verifya þetta:
    Almennt skal huga að öryggi m.t.t. OWASP top 10. Þetta á sérstaklega við notendaumsjón og þegar tekið er við gögnum.

HOSTING
Setja skal upp vefinn á Render, Railway eða Heroku (ath að uppsetning á Heroku mun kosta) tengt við GitHub með postgres settu upp.