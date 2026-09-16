// Config de react-oidc-context apuntando al User Pool de Cognito.
// Si Entra External ID está federado dentro de Cognito, no cambia nada acá:
// Cognito sigue siendo el authority, Entra solo aparece como botón "Iniciar con Microsoft"
// dentro del Hosted UI de Cognito.
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
