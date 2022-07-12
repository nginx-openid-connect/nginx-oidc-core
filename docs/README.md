# NGINX OpenID Connect Documents

This directory provides additional documents to help you set up OIDC configuration and locally test in container(s) step-by-step. You could also find what each configuration variable means in detail.

## Table of Contents
- [IDP Configuration Details](./oidc-idp-config/)
- [NGINX Plus Configuration Details](./oidc-nginx-config/)
- [NGINX Plus PKCE Setup Examples](./oidc-pkce/)
- [How to Run NGINX Plus OIDC In Docker](../docker/)
- [How to Customize Tokens with a Custom Claim](./oidc-custom-claim/)

## References
- [NGINX OpenID Connect](https://github.com/nginxinc/nginx-openid-connect)
- [Enabling Single Sign-On for Proxied Applications](https://docs.nginx.com/nginx/deployment-guides/single-sign-on/)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
  - [OIDC Token Request](http://openid.net/specs/openid-connect-core-1_0.html#TokenRequest)
  - [Refresh Access Token](https://openid.net/specs/openid-connect-core-1_0.html#RefreshingAccessToken)
  - [Refresh Error Response](https://openid.net/specs/openid-connect-core-1_0.html#RefreshErrorResponse)
  - [Successful Refresh Response](https://openid.net/specs/openid-connect-core-1_0.html#RefreshTokenResponse)
  - [ID Token Validation](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation)
  - [Access Token Validation](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowTokenValidation)
- [RFC7519: JWT Claims](https://datatracker.ietf.org/doc/html/rfc7519#page-8)
