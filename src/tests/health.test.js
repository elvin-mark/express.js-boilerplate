const request = require("supertest");
const app = require("../main");

describe("GET /health", () => {
  it("should return OK", async () => {
    const response = await request(app).get("/health");
    expect(response.statusCode).toBe(200);
  });
});
