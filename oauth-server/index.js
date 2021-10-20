const Koa = require('koa');
const Router = require('@koa/router');
const fetch = require('cross-fetch');

require('dotenv').config();

const app = new Koa();
const router = new Router();

const ZENDESK_OAUTH_BASE_URI = 'https://jupiterone-dev.zendesk.com/oauth';

router.get('/', ({ response }) => {
  response.body = '<a href="/install">Get Zendesk OAuth token</a>';
});

router.get('/install', ({ response }) => {
  response.redirect(
    `${ZENDESK_OAUTH_BASE_URI}/authorizations/new?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=read%20write`,
  );
});

router.get('/redirect', async ({ request, response }) => {
  const code = request.query.code;

  if (code) {
    const res = await(await fetch(`${ZENDESK_OAUTH_BASE_URI}/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI,
        scope: 'read write'
      })
    })).json()

    response.body = `OAuth token: ${res.access_token}`;
  } else {
    response.redirect('/');
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.SERVER_PORT, (e) => {
  if (e) {
    console.error(e);
  } else {
    console.log(
      `OAuth server running at http://localhost:${process.env.SERVER_PORT}`,
    );
  }
});
