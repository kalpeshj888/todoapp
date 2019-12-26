import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
//import Axios from 'axios'
//import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJfqEg+eznzC+1MA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi0zOTJrYnNiNC5hdXRoMC5jb20wHhcNMTkxMjI0MTgyNjUyWhcNMzMw
OTAxMTgyNjUyWjAhMR8wHQYDVQQDExZkZXYtMzkya2JzYjQuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwlKxgYxKBOh7y4gPEQH8mBlI
rsqEb4ZeqDy04nuO0RGcZ6aU2gs/KXJoY7GNco+QtTCutezGFDiu/k0UBkhfpOE3
qziiyX4eCAqWfBqMpWL4tRsqGwwbi4/hfIYCJI4KCf/whrRMIkLyGW7EwJOt2A9Z
mSkz4BeHEOkM2VwPr34ZcDbnRXuMH21uCTZ8HLv604zesX+PeLfop+OzuWO8vIlq
IAYQ1z24AWRUS6QACOTTFOCZlx1INfYAiIxqX0m9Nok8vtnuSEgBBTRnr5TDYXWM
BTO84Bx7Qj81YE7rkAA7VzbbxEiL2/ur/lweeKvFPR9jD4BKaGhawQsDimH0PQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTsMzAhMEewqRs7PjUf
0e0l7AnwKTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAFnUaK+0
NsKHOKYNVg75xFrA1VfleruKuxZl7k0/H+seU40hpYtv+4AFSZ/qebMjb9oQVG6I
oV4S3mCC0b/0F0F3V2mhfqFxs00Oe+zOtWckLgqmFFMN3Cyx0PNA+S+aTEsTFnaW
i8n0a7/ykhQyGbRolC+eEhFSjAWT7VOc7P4asO/rhE90P86XNYarCPX8rF4tKp3M
VpuRWeSNIQaNF4XUS79WEd6Z2NQr/N1B4DpxJQB+P8Kgr1bKQwmoJtXnq55NlYil
J08PkBJqRWo+pUXPWgat7XESvdfrq4dU5tQwDv8hl9i1JA+QD1P4951kbZ62u8SB
SuuVgBnfjiymPUg=
-----END CERTIFICATE-----`

//const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  

  // TODO: Implement token verification
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
