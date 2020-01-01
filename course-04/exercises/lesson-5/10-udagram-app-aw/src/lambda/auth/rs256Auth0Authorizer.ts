import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

import { verify } from "jsonwebtoken";
import { JwtToken } from "../../auth/JwtToken";

const cert = `-----BEGIN CERTIFICATE-----
MIIDDzCCAfegAwIBAgIJOjUl6QS0sMuyMA0GCSqGSIb3DQEBCwUAMCUxIzAhBgNV
BAMTGnRlc3QtZW5kcG9pbnQuYXUuYXV0aDAuY29tMB4XDTIwMDEwMTAwNDMwNFoX
DTMzMDkwOTAwNDMwNFowJTEjMCEGA1UEAxMadGVzdC1lbmRwb2ludC5hdS5hdXRo
MC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCYm6gYQMqCeYtk
NsFpQ8itkj4TUG0uDQwW3VMmdxMZstxAavG2agEDRdLF5vr/SfFiPOfmc4KuXXS9
8OlMVruwqI/I0MiNRj5uZAKYzgzuQIdc5bTuToNHxoa5EYyuBDP8J9Tv3NFvaLGe
H8SeAHzQs8KkjsgAEArivIEGMCsy7E6yACy3GpCncz390fNIu1xzH39xYRvdeosI
9fS0aprw6ElfDJBekd1ax5N0m8kZVEnrQC69OuHFwTqRrvbZAC65wje8i54M9z0f
It83TLPcDt/3RMMLzoxML+GEzfdpD4BNX8K9x+hD1AAIHPS9ADn9gfswUUrQFex1
nRfoP6tXAgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFDGdj2au
mf036mDpz0U0fq56YcprMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOC
AQEADwmyDb5fc+PnpRouALLnpugfgkYvzX1siIcf5sVVJ5xSg2D4vemjvZKdk9fh
nbSa7feHc8srM9fWpgNYFru09UDHa/J1NTanRgaH9k7yjonAjnAMYdkpmhet9EPT
gLonRSs42Ql/mnBPVJmpz9eL5G2I10xcU7brvfnelEE00XeFPDmCdGHplTMExFLk
09u6M9iF/itIqfRy4ZViSroRs43tzXhVDjgUkKRxL/eDNoocn3ZiutQWcWaan8qp
Nx6XPdABvaS+SQf6T6kyFp7WYcyRJAUr2vwm0NSWAEzWkQK+yqe69OIX4tR27Jdo
5y/GLK41r2SurjE1tiay8mUGLQ==
-----END CERTIFICATE-----`;

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken);
    console.log("User was authorized", jwtToken);

    return {
      principalId: jwtToken.sub,
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
    console.log("User authorized", e.message);

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

/**
 * Verifys token
 * @param authHeader
 * @returns token
 */
function verifyToken(authHeader: string): JwtToken {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return verify(token, cert, { algorithms: ["RS256"] }) as JwtToken;
}
