// react-oidc-context config pointing at the Cognito User Pool.
// If Entra External ID is federated inside Cognito nothing changes here:
// Cognito stays the authority and Entra only shows up as a "Sign in with Microsoft" button
// inside the Cognito Hosted UI.
export const oidcConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid email profile',
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};
