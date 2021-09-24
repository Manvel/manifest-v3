console.log("BACKGROUND PAGE LAUNCHED");


async function testingFetch() {
  const res = await fetch("https://postman-echo.com/basic-auth", {
  method: 'GET',
  headers: {
     "Authorization": "Basic cG9zdG1hbjpwYXNzd29yZA=="
    }
  });
  console.log(await res.json());
}

testingFetch();
