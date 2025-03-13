import request from "supertest";
import app from "../app.js";
import { beforeAll, expect, test } from "@jest/globals";

let authToken = "";

beforeAll(async () => {
  const loginRes = await request(app)
    .post("/users/login")
    .send({ identifier: "admin", password: "gamer_password" });

  authToken = loginRes.body.token;
});

test("GET /profa should return status 200 OK", async () => {
  const res = await request(app).get("/profa");
  expect(res.statusCode).toBe(200);
});

test("GET /users should return status code 200 OK with token auth", async () => {
  const res = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${authToken}`);
  expect(res.statusCode).toBe(200);
});
test("GET /users should return status code 401 Forbidden without auth", async () => {
  const res = await request(app).get("/users");
  expect(res.statusCode).toBe(401);
});
test("POST /profa should return status 201 with valid data", async () => {
  const res = await request(app)
    .post("/profa")
    .send({
      date: "2025-06-01 16:30:00",
      duration: "2 hours",
      ages: "5-7 ára",
      capacity: 25,
    })
    .set("Authorization", `Bearer ${authToken}`);

  expect(res.statusCode).toBe(201);
  expect(res.body[0]).toHaveProperty("id");
});
test("GET /laera should return status code 200 OK", async () => {
  const res = await request(app).get("/laera");
  expect(res.statusCode).toBe(200);
});
test("POST /namskeid should return 400 with invalid fields", async () => {
  const res = await request(app)
    .post("/namskeid")
    .send({
      gamer: "haha",
    })
    .set("Authorization", `Bearer ${authToken}`);

  expect(res.statusCode).toBe(400);
});
