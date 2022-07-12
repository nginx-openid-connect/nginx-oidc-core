# NGINX Configuration Variables for OpenID Connect
This directory provides the details of each variable which is related to NGINX configuration for the OpenID Connect.

- [HTTP Block Configuration](#http-block-configuration)
- [Server Block Configuration](#server-block-configuration)

<br>

## HTTP Block Configuration
This [`oidc_nginx_http.conf`](../../oidc_nginx_http.conf) is the NGINX configuration in http block for handling the various stages of OpenID Connect authorization code flow. No changes are usually required here.

| Variable                           | Description                                                                                       |
|------------------------------------|---------------------------------------------------------------------------------------------------|
| `$variables_hash_max_size`         | Sets the [maximum size of the variables hash table](http://nginx.org/en/docs/http/ngx_http_core_module.html#variables_hash_max_size). The details of setting up hash tables are provided in a [separate document](http://nginx.org/en/docs/hash.html). |
| `$post_logout_return_uri`          | Modify this if you want to redirect to a custom logout page rather than the default page after successful logout from the IdP. |
| `$return_token_to_client_on_login` | Modify this if you want to return `id_token` to the frontend app with a query parameter after successful login from the IdP. Otherwise the default value is empty. |
| `oidc_id_tokens` <br> `oidc_access_tokens` <br> `oidc_refresh_tokens` | Modify the directory of key/value store from `conf.d/` to your prefered path such as `/var/xxx/` for ID token, access token and refresh token.   |
| `$session_validation_enable`       | Modify if you want to either enable or disable session validation. `1: Enable`, `0: Disable`       |
| `$session_id_time_enable`          | Modify if you want to enable that session ID contains timestamp(hh:mm). `1: Enable`, `0: Disable`  |
| `$client_id_validation_enable`     | Modify if you want to validate if client ID is part of a session cookie. `1: Enable`, `0: Disable` |


<br>


## Server Block Configuration

This [`oidc_nginx_http.conf`](../../oidc_nginx_http.conf) is the NGINX configuration in each server block for handling the various stages of OpenID Connect authorization code flow. No changes are usually required here.

| Variable or endpoint               | Description                                                                                                        |
|------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `resolver`                         | Modify its directive to match a DNS server that is capable of resolving the IdP defined in `$oidc_token_endpoint`. <br> `127.0.0.11`: For DNS lookup of local IDP endpoint such as Keycloak. <br> `8.8.8.8`: For DNS lookup of internel IDP endpoint such as Okta and Amazon Cognito.  |
| `auth_jwt_key_file` <br> `auth_jwt_key_request` | Comment/uncomment the `auth_jwt_key_file` or `auth_jwt_key_request` directives based on whether `$oidc_jwt_keyfile` is a file or URI, respectively in the endpoint of `/login`. |
| `/_jwks_uri`                       | If using [auth_jwt_key_request](http://nginx.org/en/docs/http/ngx_http_auth_jwt_module.html#auth_jwt_key_request) to automatically fetch the JWK file from the IdP then modify the validity period and other caching options to suit your IdP. |

