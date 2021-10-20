# Zendesk Oauth server

Zendesk OAuth applications need an OAuth token for authorization. For the following
instructions, it is assumed that an OAuth app has already been created. For
instructions how to create one, see Zendesk's [Using OAuth authentication with your application](https://support.zendesk.com/hc/en-us/articles/203663836-Using-OAuth-authentication-with-your-application#topic_s21_lfs_qk).

## Steps to get an OAuth token

1. Supply your `CLIENT_ID`, `CLIENT_SECRET` and `REDIRECT_URI` from your OAuth app's credentials
   to the `.env`. See [.env.example](./env.example) as reference.

2. Input a port for the server to listen to in `.env`'s `SERVER_PORT` field.

3. Run `$ yarn start` and go to `http://localhost:{SERVER_PORT}` in your browser.

4. Click on the link and authorize your account.

5. Take note of the generated OAuth token which will be needed on the main
   integration.