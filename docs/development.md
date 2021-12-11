# Development

This integration focuses on [Zendesk](https://www.zendesk.com/) and is using the
[Zendesk API](https://developer.zendesk.com/api-reference/) for interacting with
the Zendesk resources.

## Provider account setup

This integration requires a
[Zendesk OAuth app](https://developer.zendesk.com/documentation/live-chat/getting-started/auth/).

Follow these steps to create the necessary Zendesk app:

1. Register for a Zendesk account. A pro account is not required but some
   resources may not be ingested without it.

2. Create an OAuth app by going to
   https://subdomain.zendesk.com/admin/apps-integrations/apis/apis/oauth_clients.
   (click on the 'Add OAuth Client' button)

3. Enter 'http://localhost:5000/redirect' as the redirect URL for OAuth.

4. Generate an API token by going to
   https://subdomain.zendesk.com/admin/apps-integrations/apis/apis/settings.
   (click on the 'Add API Token' button)

5. Take note of your `Client ID`, `Client Secret`, `Redirect URI` and
   `API token` and supply them to the
   [oauth server's .env file](../oauth-server/.env).

6. The app is now ready. Proceed to authentication to generate your
   `ZENDESK_ACCESS_TOKEN`.

## Authentication

To start the integration, we need to provide a ZENDESK_ACCESS_TOKEN to our .env.
Luckily, we have supplied an [oauth-server](../oauth-server) to get the token
for us. Please follow the OAuth server's [README.md](../oauth-server/README.md)
to generate the access token. Also don't forget to supply your
`ZENDESK_SUBDOMAIN` to the .env file. Once that's done, you should now be able
to start contributing to this integration. The integration will pull in the
ZENDESK_ACCESS_TOKEN variable from the .env file and use it when making
requests.
