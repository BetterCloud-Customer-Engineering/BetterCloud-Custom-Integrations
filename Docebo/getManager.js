const axios = require("axios");

const getManagerTypeId = async (managerTypeTitle, secrets, auth, error) => {
    try {
        const getManagerTypesRequest = {
            url: `https://${secrets.domain}.docebosaas.com/manage/v1/managers?page_size=200&as_array=1`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": auth
            }
        };

        const response = await axios(getManagerTypesRequest);
        const managerTypes = response.data.data.items.filter(managerType => managerTypeTitle.toLowerCase().trim() === managerType.title.toLowerCase().trim());

        if (managerTypes.length > 1) {
            error(`More than 1 manager type was found with title ${managerTypeTitle}`);
        } else if (managerTypes.length === 0) {
            error(`No manager type found with title ${managerTypeTitle}`);
        } else {
            return managerTypes[0].id;
        }
    } catch (err) {
        error(`Failed to get Manager Type Id for title ${managerTypeTitle}: ${err}`);
    }
};

const getManagerId = async (email, secrets, auth, error) => {
    try {
        const getUserRequest = {
            url: `https://${secrets.domain}.docebosaas.com/manage/v1/managers/candidates?page_size=200&search_text=${email}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": auth
            }
        };

        const response = await axios(getUserRequest);
        const managers = response.data.data.items.filter(manager => email.toLowerCase().trim() === manager.manager_email.toLowerCase().trim());

        if (managers.length > 1) {
            error(`More than 1 manager was found with email ${email}`);
        } else if (managers.length === 0) {
            error(`No manager found with email ${email}`);
        } else {
            return managers[0].manager_id;
        }
    } catch (err) {
        error(`Failed to get Manager Id for email ${email}: ${err}`);
    }
};

module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        const managerTypeId = await getManagerTypeId(request.body.managerTypeTitle, input.secrets, request.headers.Authorization, error);
        delete request.body.managerTypeTitle;
        const managerId = await getManagerId(request.body.managerEmail, input.secrets, request.headers.Authorization, error);
        delete request.body.managerEmail;
        request.body.manager = {};
        request.body.manager[managerTypeId] = managerId;
        callback(request);
    } catch (err) {
        error(`getManager Pre Request failed: ${err}`)
    }
};
