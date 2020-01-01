import {
  CustomAuthorizerEvent,
  CustomAuthorizerResult,
  CustomAuthorizerHandler
} from "aws-lambda";
import "source-map-support/register";
// import * as middy from "middy";
// import { secretsManager } from "middy/middlewares";

import { verify } from "jsonwebtoken";
import { JwtToken } from "../../auth/JwtToken";

const auth0Secret = process.env.AUTH_0_SECRET;

// const secretId = process.env.AUTH_0_SECRET_ID;
// const secretField = process.env.AUTH_0_SECRET_FIELD;

export const handler: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    const decodedToken = verifyToken(event.authorizationToken);
    console.log("User was authorized");

    return {
      principalId: decodedToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*"
          }
        ]
      }
    };
  } catch (e) {
    console.log("User was not authorized", e.message);

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*"
          }
        ]
      }
    };
  }
};

// try {
//   const decodedToken = verifyToken(
//     event.authorizationToken,
//     context.AUTH0_SECRET[secretField]
//   )
//   console.log('User was authorized', decodedToken)

//   return {
//     principalId: decodedToken.sub,
//     policyDocument: {
//       Version: '2012-10-17',
//       Statement: [
//         {
//           Action: 'execute-api:Invoke',
//           Effect: 'Allow',
//           Resource: '*'
//         }
//       ]
//     }
//   }
// } catch (e) {
//   console.log('User was not authorized', e.message)

//   return {
//     principalId: 'user',
//     policyDocument: {
//       Version: '2012-10-17',
//       Statement: [
//         {
//           Action: 'execute-api:Invoke',
//           Effect: 'Deny',
//           Resource: '*'
//         }
//       ]
//     }
//   }
// }
// })

// /**
//  * Verifys token
//  * @param authHeader
//  * @param secret
//  * @returns token
//  */
// function verifyToken(authHeader: string, secret: string): JwtToken {
//   if (!authHeader) throw new Error("No authentication header");

//   if (!authHeader.toLowerCase().startsWith("bearer "))
//     throw new Error("Invalid authentication header");

//   const split = authHeader.split(" ");
//   const token = split[1];

//   return verify(token, secret) as JwtToken;
// }

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return verify(token, auth0Secret) as JwtToken;
}

// handler.use(
//   secretsManager({
//     cache: true,
//     cacheExpiryInMillis: 60000,
//     // Throw an error if can't read the secret
//     throwOnFailedCall: true,
//     secrets: {
//       AUTH0_SECRET: secretId
//     }
//   })
// )

// export const handler = middy(
//   async (
//     event: CustomAuthorizerEvent,
//     context
//   ): Promise<CustomAuthorizerResult> => {
//     try {
//       const decodedToken = verifyToken(
//         event.authorizationToken,
//         context.AUTH0_SECRET[secretField]
//       );
//       console.log("User was authorized", decodedToken);

//       return {
//         principalId: decodedToken.sub,
//         policyDocument: {
//           Version: "2012-10-17",
//           Statement: [
//             {
//               Action: "execute-api:Invoke",
//               Effect: "Allow",
//               Resource: "*"
//             }
//           ]
//         }
//       };
//     } catch (e) {
//       console.log("User was not authorized", e.message);

//       return {
//         principalId: "user",
//         policyDocument: {
//           Version: "2012-10-17",
//           Statement: [
//             {
//               Action: "execute-api:Invoke",
//               Effect: "Deny",
//               Resource: "*"
//             }
//           ]
//         }
//       };
//     }
//   }
// );

// /**
//  * Verifys token
//  * @param authHeader
//  * @param secret
//  * @returns token
//  */
// function verifyToken(authHeader: string, secret: string): JwtToken {
//   if (!authHeader) throw new Error("No authentication header");

//   if (!authHeader.toLowerCase().startsWith("bearer "))
//     throw new Error("Invalid authentication header");

//   const split = authHeader.split(" ");
//   const token = split[1];

//   return verify(token, secret) as JwtToken;
// }

// handler.use(
//   secretsManager({
//     cache: true,
//     cacheExpiryInMillis: 60000,
//     // Throw an error if can't read the secret
//     throwOnFailedCall: true,
//     secrets: {
//       AUTH0_SECRET: secretId
//     }
//   })
// );
