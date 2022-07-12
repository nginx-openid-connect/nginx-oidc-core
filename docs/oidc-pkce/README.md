# NGINX OIDC - PKCE w/ Amazon Cognito, OneLogin, Okta

This doc provides how to configure and test PKCE in IdPs and NGINX.conf in NGINX Plus.

- [PKCE Setup with Amazon Cognito](#pkce-setup-with-amazon-cognito)
- [PKCE Setup with OneLogin](#pkce-setup-with-oneLogin)
- [PKCE Setup with Okta](#pkce-setup-with-okta)
- [PKCE Setup with NGINX Plus](#pkce-setup-with-nginx-plus)
- [Access Web with PKCE](#access-web-with-pkce)

## PKCE Setup with Amazon Cognito

Set up PKCE into your application with AWS Cognito.

> **Select `App clients` under `General Settings` of `User Pools`:**

![](./img/01-01-aws-cognito-pkce.png)

> **Create App Clients:**

Note that you should not create credentials for setting up PKCE when creating an app client.

![](./img/01-02-aws-cognito-pkce.png)

> **Select `App client settings` under `App integration` of `User Pools`:**

![](./img/01-03-aws-cognito-pkce.png)

> **Set Up Callback URL and OAuth Flows & Scopes:**

![](./img/01-04-aws-cognito-pkce.png)

## PKCE Setup with OneLogin

Set up PKCE into your application with OneLogin. Note that `redirect URIs` must be also set up.

> **Add an app and select one of applications (i.e. `my-nginx-plus-pkce`) under the menu of `Applications`:**

![](./img/02-01-onelogin-pkce.png)

> **Select `None(PKCE)` from the dropbox of `Application Type` under `SSO` Menu:**

![](./img/02-02-onelogin-pkce.png)

## PKCE Setup with Okta

Set up PKCE into your application with Okta.

> **Create a new app integration via the menu of `Applications`**:

In this example, select `Single-Page Application` in the `Application Type`. Note that the `Web Application` doesn't support PKCE.

![](./img/03-01-okta-pkce.png)

> **Set Up `Grant type` and `Sign-in recirect URIs`**:

Note that the `Authorization Code` must be set up. The `recirect URIs` is same as `Callback URL` setup in Amazon Cognito.

![](./img/03-02-okta-pkce.png)

> **Selet one of your applications (For example, `my-nginx-plus-pkce`)**:

You could find the Client authentization is `Use PKCE(for public clients)` as the following configuration when selecting your app.

![](./img/03-03-okta-pkce.png)

## PKCE Setup with NGINX Plus

> **Client ID Setup**:

Copy your client ID from the each IDP's setup, and either create [/etc/nginx/conf.d/oidc_idp.conf](../../oidc_idp.conf) with the following configurations.
Note that the `$oidc_client` directive isn't needed for PKCE workflow.

```nginx
map $host $oidc_client {
    mynginxpkce.aws         "your client ID";
    mynginxpkce.one         "your client ID";
    mynginxpkce.okta        "your client ID";
}
```

> **PKCE Setup**:

Set `1` to each `$host` of the `$oidc_pkce_enable` in the [etc/nginx/conf.d/oidc_idp.conf](../../oidc_idp.conf).

```nginx
map $host $oidc_pkce_enable {
    mynginxpkce.aws         1;
    mynginxpkce.one         1;
    mynginxpkce.okta        1;
}
```

> **Server Setup**:

You could simply set up your server by adding port, server name, certificates (optional, but, recommended in production), and by including sample configurations as the following configuration in the [/etc/nginx/conf.d/oidc_frontend_backend.conf](../../oidc_frontend_backend.conf):

```nginx
server {
    listen 8010; # Use SSL/TLS in production
    server_name mynginxpkce.okta;

    location / {
        proxy_pass http://my_frontend_site;
        access_log /var/log/nginx/access.log oidc_jwt;
    }

    location /v1/api/example {
        proxy_set_header Authorization "Bearer $access_token";
        # proxy_set_header x-id-token  "$id_token"; # Enable when needed
        proxy_pass http://my_backend_app;
        access_log /var/log/nginx/access.log oidc_jwt;
    }
}
```

## Access Web with PKCE

You have set up PKCE with multiple IDPs and NGINX Plus. Now you are ready to start checking if you could access your page with the PKCE setup.

Given the above setup, you could just type your host name in your web browser and test it if it works.
