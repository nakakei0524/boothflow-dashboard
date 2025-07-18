import { Amplify } from 'aws-amplify';

const authConfig = {
  Cognito: {
    userPoolId: process.env.REACT_APP_USER_POOL_ID || "ap-northeast-1_gOiAtMjfB", // デフォルト値をセット
    userPoolClientId: "4g55pakh2lpm1pki6jhumscnhl",
    signUpVerificationMethod: "code" as const,
  }
};

Amplify.configure({
  Auth: authConfig
});

export default authConfig;
