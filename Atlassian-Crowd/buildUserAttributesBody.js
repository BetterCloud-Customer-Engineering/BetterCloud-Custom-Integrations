const buildNewRequestBody = (data) => {
    let newRequestBody = {};
    let attributes = [];
    for (let parameter in data) {
        if (data[parameter] !== null) {
            attributes.push({name: parameter, values: [data[parameter]]});
        }
    }
    newRequestBody["attributes"] = attributes;
    return newRequestBody;
};

module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        let newBody = buildNewRequestBody(request.body);
        request.body = newBody;
        callback(request);
    } catch (err) {
        error(`buildUserAttributesBody pre request script failed: ${err}`);
    }
};
