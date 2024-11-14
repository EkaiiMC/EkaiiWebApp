import NextAuth from 'next-auth'
import {PrismaAdapter} from "@auth/prisma-adapter";
import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id";
import prisma from "@/db";
import {addDashes} from "@/utils";
import {logger} from "@/logger";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [MicrosoftEntraID({
    issuer: 'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0',
    authorization: {
      params: {
        scope: 'openid email XboxLive.signin',
      },
    },
    allowDangerousEmailAccountLinking: true,
    async profile(profile, tokens) {
      if(tokens.id_token) {
        const decoded = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString('utf-8')) as {email: string}
        const xbox = await fetch(
          'https://user.auth.xboxlive.com/user/authenticate',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              RelyingParty: 'http://auth.xboxlive.com',
              TokenType: 'JWT',
              Properties: {
                AuthMethod: 'RPS',
                SiteName: 'user.auth.xboxlive.com',
                RpsTicket: `d=${tokens.access_token}`,
              },
            }),
          }
        );

        if (xbox.ok) {
          const xboxRes = (await xbox.json()) as {Token?: string, DisplayClaims: {xui: {uhs?: string}[]}};

          const xboxToken = xboxRes.Token;
          const xboxUserHash = xboxRes.DisplayClaims.xui[0].uhs;

          if (xboxToken && xboxUserHash) {
            const xsts = await fetch(
              'https://xsts.auth.xboxlive.com/xsts/authorize',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
                body: JSON.stringify({
                  Properties: {
                    SandboxId: 'RETAIL',
                    UserTokens: [xboxToken],
                  },
                  RelyingParty: 'rp://api.minecraftservices.com/',
                  TokenType: 'JWT',
                }),
              }
            );

            if(xsts.ok) {
              const xstsRes = (await xsts.json()) as {Token?: string};

              if(xstsRes.Token) {
                const minecraft = await fetch(
                  'https://api.minecraftservices.com/authentication/login_with_xbox',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                    },
                    body: JSON.stringify({
                      identityToken: 'XBL3.0 x='+xboxUserHash+';'+xstsRes.Token,
                      ensureLegacyEnabled: true,
                    }),
                  }
                );

                if(minecraft.ok) {
                  const minecraftRes = (await minecraft.json()) as {access_token: string};

                  if(minecraftRes.access_token) {
                    const minecraftProfile = await fetch(
                      'https://api.minecraftservices.com/minecraft/profile',
                      {
                        headers: {
                          Authorization: `Bearer ${minecraftRes.access_token}`,
                        },
                      }
                    );

                    if(minecraftProfile.ok) {
                      const minecraftProfileRes = (await minecraftProfile.json()) as { id: string, name: string };

                      minecraftProfileRes.id = addDashes(minecraftProfileRes.id)

                      const obj = {
                        id: minecraftProfileRes.id,
                        name: minecraftProfileRes.name,
                        username: minecraftProfileRes.name,
                        email: decoded.email,
                        image: 'https://mc-heads.net/avatar/'+minecraftProfileRes.name+'/256',
                      }

                      logger.debug(`User ${obj.name} logged in`)

                      return obj
                    }
                  }
                }
              }
            }
          }
        }
      }

      throw new Error('Failed to fetch Minecraft profile')
    },
  })],
  callbacks: {
    async session({session, user}) {

      await prisma.account.update({
        where: {
          userId: user.id,
        },
        data: {
          access_token: null
        },
      });

      // @ts-ignore
      session.user.role = user.role;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth-error',
  }
})