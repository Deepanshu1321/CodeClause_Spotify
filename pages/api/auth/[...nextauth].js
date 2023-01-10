import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token) {

    // GC

    // Refresh the access token using the refresh token
    /*const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.NEXT_PUBLIC_CLIENT_ID +
              ":" +
              process.env.NEXT_PUBLIC_CLIENT_SECRET
          ).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });
  
    const data = await response.json();
  
    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
    };*/

    //SS-Y
    try {

        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        console.log("REFRESHED TOKEN IS", refreshedToken);

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        };

    } catch (error) {
        console.log(error);
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        }
    }

}

export const authOptions = ({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL,
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, account, user }) {

            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000,
                }
            }

            //Return previous token if the access token has not expired yet
            if (token.accessTokenExpires > Date.now()) {
                console.log("EXISTING ACCESS TOKEN IS STILL VALID");
                return token;
            }


            //access token has expired, refresh it
            console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;
            return session;
        }
    },

})

export default NextAuth(authOptions);