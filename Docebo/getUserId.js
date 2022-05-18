const axios = require("axios");

const getUserId = async (email, secrets, auth, error) => {
    try {
        const getUserRequest = {
            url: `https://${secrets.domain}.docebosaas.com/manage/v1/user?minimalistic=true&match_type=full&page_size=200&search_text=${email}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": auth
            }
        };

        const response = await axios(getUserRequest);
        const users = response.data.data.items.filter(user => email.toLowerCase().trim() === user.email.toLowerCase().trim());

        if (users.length > 1) {
            error(`More than 1 user was found with email ${email}`);
        } else if (users.length === 0) {
            error(`No users found with email ${email}`);
        } else {
            return users[0].user_id;
        }
    } catch (err) {
        error(`Failed to get User Id for email ${email}: ${err}`);
    }
};

module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        const userId = await getUserId(request.body.email, input.secrets, request.headers.Authorization, error);
        request.url = request.url.replace("{userId}", userId);
        callback(request);
    } catch (err) {
        error(`getUserId Pre Request failed: ${err}`)
    }
};
