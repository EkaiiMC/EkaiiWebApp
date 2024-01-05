import {NextAuthOptions} from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";
import {JWT} from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: "openid profile email offline_access XboxLive.signin"
        }
      }
    }),
  ],

  callbacks: {
    async jwt({token, user, account, profile}): Promise<JWT> {
      console.log(token);

      // Xbox Live Auth
      const xboxLiveAuth: string = "https://user.auth.xboxlive.com/user/authenticate"
      const request: {
        method: string,
        headers: { 'Content-Type': string, 'Accept'?: string, 'Authorization'?: string },
        body: string
      } = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          "Properties": {
            "AuthMethod": "RPS",
            "SiteName": "user.auth.xboxlive.com",
            "RpsTicket": `d=${account!.access_token}`
          },
          "RelyingParty": "http://auth.xboxlive.com",
          "TokenType": "JWT"
        })
      };
      let res = await fetch(xboxLiveAuth, request)
      if (!res.ok) {
        throw new Error(`Failed to fetch Xbox Live token: ${res.statusText}`)
      }
      let json = await res.json();
      let authToken = json["Token"];
      let userHash = json["DisplayClaims"]["xui"][0]["uhs"];

      // Get XSTS Token
      const xstsAuth: string = "https://xsts.auth.xboxlive.com/xsts/authorize"
      request.body = JSON.stringify({
        "Properties":
          {
            "SandboxId": "RETAIL",
            "UserTokens": [authToken]
          },
        "RelyingParty": "rp://api.minecraftservices.com/",
        "TokenType": "JWT"
      });

      res = await fetch(xstsAuth, request);
      if (!res.ok) {
        throw new Error(`Failed to fetch XSTS token: ${res.statusText}`)
      }
      json = await res.json();
      const xstsToken = json["Token"];

      // Get Minecraft Token
      delete request.headers.Accept;
      request.body = JSON.stringify({
        "identityToken": `XBL3.0 x=${userHash};${xstsToken}`,
        "ensureLegacyEnabled": true
      });

      /*res = await fetch("https://api.minecraftservices.com/authentication/login_with_xbox", request);
      if (!res.ok) {
        if (res.status === 403) {
          json = await res.json();
          console.log(json);
        }
        throw new Error(`Failed to fetch Minecraft bearer: ${res.statusText}`)
      }
      json = await res.json();
      const minecraftToken = json["access_token"];

      // Get Minecraft Profile
      request.headers["Authorization"] = `Bearer ${minecraftToken}`;
      res = await fetch("https://api.minecraftservices.com/minecraft/profile", request);
      if (!res.ok) {
        throw new Error(`Failed to fetch profile information: ${res.statusText}`)
      }
      json = await res.json();

      console.log(json);*/
      console.log(token)
      return token;
    }
  }
};