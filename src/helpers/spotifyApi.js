import SpotifyWebApi from 'spotify-web-api-node';
import randomString from '../utils/string/random';
import { SPOTIFY } from '../config/constants';

class customSpotifyApi extends SpotifyWebApi {
    genState() {
        return randomString(SPOTIFY.STATE.LENGTH);
    }
    createAuthorizeURL(state) {
        return super.createAuthorizeURL(SPOTIFY.SCOPES, state);
    }
    getProfileFromCodeGrant(code) {
        return new Promise((resolve, reject) => {
            this.authorizationCodeGrant(code)
                .then((codeGrantRes) => {
                    return codeGrantRes.body;
                })
                .then((codeGrant) => {
                    this.setAccessToken(codeGrant.access_token);
                    return this.getMe();
                })
                .then((profileRes) => { resolve(profileRes.body); })
                .catch((error) => { reject(error); });
        })
    }
}

const spotifyApi = new customSpotifyApi({
    clientId: SPOTIFY.CLIENT_ID,
    clientSecret: SPOTIFY.SECRET,
    redirectUri: SPOTIFY.REDIRECT_URI,
});

export default spotifyApi;