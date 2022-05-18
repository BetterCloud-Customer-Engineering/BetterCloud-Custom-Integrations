const axios = require('axios');

const getFields = async (secrets, auth, error) => {
    try {
        const getFieldsRequest = {
            url: `https://${secrets.domain}.docebosaas.com/manage/v1/user_fields?as_array=1&page_size=100`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": auth
            }
        };

        const response = await axios(getFieldsRequest);
        return response.data.data;
    } catch (err) {
        error(`Error getting field data in function getFieldData: ${err}.`);
    }
};

module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        const fields = await getFields(input.secrets, request.headers.Authorization, error);
        const fieldNames = Object.keys(request.body['additional_fields']);
        fieldNames.forEach((fieldName) => {
            if (request.body['additional_fields'][fieldName] !== null) {
                const field = fields.find(field => field.title.toLowerCase().trim() === fieldName.toLowerCase().trim());
                const fieldValue = request.body['additional_fields'][fieldName];
                if (field !== undefined) {
                    request.body['additional_fields'][field.id] = fieldValue;
                    if (field.type === 'dropdown') {
                        const option = field.options.find(option => option.label.toLowerCase().trim() === fieldValue.toLowerCase().trim());
                        if (option !== undefined) {
                            request.body['additional_fields'][field.id] = option.id;
                        } else {
                            error(`Error finding option with label ${fieldValue}`);
                        }
                    }
                } else {
                    error(`Error finding field with ${fieldName}`);
                }
            } else {
                delete request.body['additional_fields'][fieldName];
            }
        });
        callback(request);
    } catch (err) {
        error(`getAdditionalFieldData pre request script failed: ${err}`);
    }
};


// const logger = async (message, data) => {
//     const loggerRequest = {
//         "url": "https://webhook.site/fb6eaf90-040d-42e3-b716-e98b9bca8e6b",
//         "method": "POST",
//         "headers": {"content-type": "application/json"},
//         "data": {
//             message,
//             data
//         }
//     }
//
//     try {
//         await axios(loggerRequest);
//     } catch (err) {
//         console.log(err);
//     }
// }