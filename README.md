# Taekwondo Vefsíða

## Uppsetning verkefnisins

Byggja þarf verkefnið með
```
npm install
```

Svo þarf að fylla út öll svæði sem vantar í .env.example og breyta nafni í .env

## Notkun

Hægt er að logga sig inn á admin aðgang með:

```
POST /users/login
```

```
{ "identifier": "admin", "password": "gamer_password" }
```

## API Routes

Nær í lista af prufutímum:
```
GET /profa
```

```
{
    "data": [
        {
            "id": 1,
            "date": "2025-03-14T20:01:05.800Z",
            "duration": {
                "hours": 1,
                "minutes": 30
            },
            "ages": "5-7 ára",
            "capacity": 20,
            "created": "2025-03-13T20:01:05.800Z",
            "updated": "2025-03-13T20:01:05.800Z"
        },
        {
            "id": 2,
            "date": "2025-03-15T20:01:05.800Z",
            "duration": {
                "minutes": 30
            },
            "ages": "5-7 ára",
            "capacity": 25,
            "created": "2025-03-13T20:01:05.800Z",
            "updated": "2025-03-13T20:01:05.800Z"
        },
        {
            "id": 3,
            "date": "2025-03-18T22:01:05.800Z",
            "duration": {
                "seconds": 50
            },
            "ages": "8-12 ára",
            "capacity": 52,
            "created": "2025-03-13T20:01:05.800Z",
            "updated": "2025-03-13T20:01:05.800Z"
        },
        {
            "id": 4,
            "date": "2025-03-14T20:01:05.800Z",
            "duration": {
                "hours": 1,
                "minutes": 30
            },
            "ages": "fullorðnir",
            "capacity": 5,
            "created": "2025-03-13T20:01:05.800Z",
            "updated": "2025-03-13T20:01:05.800Z"
        },
        {
            "id": 5,
            "date": "2025-03-13T20:01:05.800Z",
            "duration": {
                "days": 15
            },
            "ages": "fullorðnir",
            "capacity": 120,
            "created": "2025-03-13T20:01:05.800Z",
            "updated": "2025-03-13T20:01:05.800Z"
        }
    ],
    "offset": 0,
    "limit": 5,
    "total": 5,
    "_links": {
        "self": {
            "href": "http://127.0.0.1:3000/profa?offset=0&limit=5"
        }
    },
    "meta": {
        "total": 5,
        "offset": 0,
        "limit": 5,
        "hasNext": false,
        "hasPrev": false
    }
}
```

Fær lista af öllum notendum (bara hægt sem admin)

```
GET /users
```

```
{
    "data": [
        {
            "row": "(1,admin,admin@example.org,t,\"2025-03-13 20:01:05.800177+00\")"
        },
        {
            "row": "(2,user,user@example.org,f,\"2025-03-13 20:01:05.800177+00\")"
        }
    ],
    "offset": 0,
    "limit": 5,
    "total": 2,
    "_links": {
        "self": {
            "href": "http://127.0.0.1:3000/users?offset=0&limit=5"
        }
    },
    "meta": {
        "total": 2,
        "offset": 0,
        "limit": 5,
        "hasNext": false,
        "hasPrev": false
    }
}
```

Býr til nýtt námskeið:

```
POST /namskeid
{
    "name": "testname",
    "description": "test description",
    "level": "byrjendur",
    "start_date": "2025-02-22 21:00:00",
    "end_date": "2025-03-22 21:00:00"
}
```

```
[
    {
        "id": 22,
        "name": "testname",
        "description": "test description",
        "level": "byrjendur",
        "start_date": "2025-02-22T22:00:00.000Z",
        "end_date": "2025-03-22T22:00:00.000Z",
        "created": "2025-03-13T20:09:59.619Z",
        "updated": "2025-03-13T20:09:59.619Z"
    }
]
```

Og einnig er hægt að uppfæra námskeið með ```PATCH``` í stað ```POST```, á t.d. ```/namskeid/22```.

o.s.frv.

## Tests og linting

Hægt er einnig að keyra tests með 
```npm run test```
Og linting með
```npm run lint```

## Credits

Ragnar Björn Ingvarsson, Skogarbjorn

Ólafur Sær Sigursteinsson, Amaragance682

&copy; 2025 gamer
