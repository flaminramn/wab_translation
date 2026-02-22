module.exports = async function (context, req) {

  const { password } = req.body || {};

  const correctPassword = process.env.SITE_PASSWORD;

  if (!password || password !== correctPassword) {
    context.res = {
      status: 401,
      body: "Invalid password"
    };
    return;
  }

  context.res = {
    status: 200,
    headers: {
      "Set-Cookie": "siteAuth=true; HttpOnly; Secure; SameSite=Strict; Path=/"
    },
    body: "Authenticated"
  };
};