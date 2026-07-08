export class ClaimType {
  // XML SOAP
  static emailAddress = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
  static givenName = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname';
  static role = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  static nameIdentifier = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
  static group = 'http://schemas.xmlsoap.org/claims/Group';

  // Microsoft
  static authenticationMethod = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod';
  static authenticationInstant = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant';
  static identityProvider = 'http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider';

  // Code Architects
  static language = 'http://schemas.codearchitects.com/claims/language';
  static tenant = 'http://schemas.codearchitects.com/claims/tenant';
  static authenticated = 'http://schemas.codearchitects.com/claims/authenticated';
}
