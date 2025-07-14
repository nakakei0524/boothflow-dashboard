import { Amplify } from 'aws-amplify';

const authConfig = {
  Cognito: {
    userPoolId: "ap-northeast-1_gOiAtMjfB",
    userPoolClientId: "4g55pakh2lpm1pki6jhumscnhl",
    signUpVerificationMethod: "code" as const,
  }
};

Amplify.configure({
  Auth: authConfig
});

export default authConfig;
