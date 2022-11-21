import { faker } from "@faker-js/faker";

fetch("http://localhost:8080/api/v1/db/data/v1/gdc-admin-poc/Members", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "xc-auth":
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZsYXZpZW5AZ2Vuc2RlY29uZmlhbmNlLmNvbSIsImZpcnN0bmFtZSI6bnVsbCwibGFzdG5hbWUiOm51bGwsImlkIjoidXNfeDB4b2V6dXhjOHNoZDIiLCJyb2xlcyI6InVzZXIsc3VwZXIiLCJ0b2tlbl92ZXJzaW9uIjoiNDY5ODMwY2NhY2U4MTQ2MzAxNjcyMjcyNGFkYmE5MjQzNWRmOTQ2MWM1NWZjYjkxYmNmYzU5NjY3ZmM0NjY1MTc0ZmI4ZThjMmFkMmIzZTUiLCJpYXQiOjE2NjkwMzcxODAsImV4cCI6MTY2OTA3MzE4MH0.x2g0Wa9EjLOaxiw6ZmfqAIQIO1kdV5Wv27tADymr8-E",
  },
  body: JSON.stringify({
    Name: faker.name.fullName(),
    Avatar: faker.image.people(undefined, undefined, true),
  }),
})
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));
