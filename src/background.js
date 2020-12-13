let active_tabId = null;

const CLIENT_ID = encodeURIComponent('972083071fb34e259b95d81ca0ac085b'),
    RESPONSE_TYPE = encodeURIComponent('code'),
    REDIRECT_URI = encodeURIComponent(chrome.identity.getRedirectURL()),
    CODE_CHALLENDGE_METHOD = encodeURIComponent('S256'),
    SCOPE = encodeURIComponent('user-modify-playback-state user-read-playback-state'),
    SHOW_DIALOG = encodeURIComponent('true');

let STATE = '',
    CODE_VERIFIER = '',
    ACCESS_TOKEN = '',
    REFRESH_TOKEN = '';

let user_signed_in = false;

function rand_string() {
    return Math.random().toString(36).substring(2);
}

function clear_tokens() {
    ACCESS_TOKEN = '';
    REFRESH_TOKEN = '';
    user_signed_in = false;
}

function get_authorization_code_endpoint() {
    return new Promise(async (resolve, reject) => {
        CODE_VERIFIER = rand_string().repeat('5');
        const code_challenge = base64urlencode(await sha256(CODE_VERIFIER));
        STATE = encodeURIComponent('meet' + rand_string());

        const oauth2_url =
            `https://accounts.spotify.com/authorize
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&code_challenge_method=${CODE_CHALLENDGE_METHOD}
&code_challenge=${code_challenge}
&state=${STATE}
&scope=${SCOPE}
&show_dialog=${SHOW_DIALOG}`;

        resolve({
            message: 'success',
            auth_endpoint: oauth2_url
        });
    });
}

function get_access_token_endpoint(code) {
    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${CLIENT_ID}&grant_type=authorization_code&code=${code}&redirect_uri=${chrome.identity.getRedirectURL()}&code_verifier=${CODE_VERIFIER}`
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error('could not get token');
            }
        })
        .then(res => {
            return {
                ...res,
                message: 'success'
            }
        });
}

function get_refresh_token() {
    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${CLIENT_ID}&grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}`
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error('could not get token');
            }
        })
        .then(res => {
            return {
                ...res,
                message: 'success'
            }
        });
}

/*
PUT - 204
https://api.spotify.com/v1/me/player/pause
https://api.spotify.com/v1/me/player/play
 
POST - 204
https://api.spotify.com/v1/me/player/next
https://api.spotify.com/v1/me/player/previous
 
GET - 200 for content - 204 for no content being played
https://api.spotify.com/v1/me/player/currently-playing
*/
const player = {
    play: function () {
        return fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })
            .then(res => {
                if (res.status === 204) {
                    return 'success';
                } else {
                    throw new Error('fail');
                }
            });
    },
    pause: function () {
        return fetch(`https://api.spotify.com/v1/me/player/pause`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })
            .then(res => {
                if (res.status === 204) {
                    return 'success';
                } else {
                    throw new Error('fail');
                }
            });
    },
    next: function () {
        return fetch(`https://api.spotify.com/v1/me/player/next`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })
            .then(res => {
                if (res.status === 204) {
                    return 'success';
                } else {
                    throw new Error('fail');
                }
            });
    },
    prev: function () {
        return fetch(`https://api.spotify.com/v1/me/player/previous`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })
            .then(res => {
                if (res.status === 204) {
                    return 'success';
                } else {
                    throw new Error('fail');
                }
            });
    },
    current: function () {
        return fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })
            .then(res => {
                if (res.status === 200 || res.status === 204) {
                    return res.json();
                } else {
                    // return 'fail';
                    throw new Error('fail');
                }
            })
            .then(res => {
                return `${res.item.artists[0].name} - ${res.item.name}`;
            });
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.from === 'popup' && request.message === 'login') {
        // sign the user in with Spotify
        get_authorization_code_endpoint()
            .then(res => {
                if (res.message === 'success') {
                    chrome.identity.launchWebAuthFlow({
                        url: res.auth_endpoint,
                        interactive: true
                    }, function (redirect_url) {
                        if (chrome.runtime.lastError || redirect_url.includes('error=access_denied')) {
                            sendResponse({ message: 'fail' });
                        } else {
                            const state = redirect_url.substring(redirect_url.indexOf('state=') + 6);
                            const code = redirect_url.substring(redirect_url.indexOf('code=') + 5);

                            if (state === STATE) {
                                get_access_token_endpoint(code)
                                    .then(res => {
                                        if (res.message === 'success') {
                                            user_signed_in = true;
                                            ACCESS_TOKEN = res.access_token;
                                            REFRESH_TOKEN = res.refresh_token;

                                            // only one refresh is allowed, so get that refresh token after original 'expires'
                                            setTimeout(() => {
                                                get_refresh_token()
                                                    .then(res => {
                                                        if (res.message === 'success') {
                                                            ACCESS_TOKEN = res.access_token;

                                                            // only one refresh is allowed, so clear tokens after 'expires'
                                                            setTimeout(() => {
                                                                clear_tokens();
                                                            }, res.expires_in * 1000);
                                                        }
                                                    });
                                            }, res.expires_in * 1000);

                                            sendResponse({ message: 'success' }); // for future version, make sure only to sendResponse when the 'sendMessage' above is successful
                                        } else {
                                            sendResponse({ message: 'fail' });
                                        }
                                    })
                                    .catch(err => sendResponse({ message: 'fail' }));
                            } else {
                                sendResponse({ message: 'fail' });
                            }
                        }
                    });
                } else {
                    sendResponse({ message: 'fail' });
                }
            })
            .catch(err => sendResponse({ message: 'fail' }));

        return true;
    } else if (request.from === 'popup' && request.message === 'logout') {
        clear_tokens();

        sendResponse({ message: 'success' });
    }
});