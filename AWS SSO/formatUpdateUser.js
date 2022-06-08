module.exports = async (input, callback, error) => {
    try{
        let request = input.request;
        let url = input.request.url;

        request.url = url.replace("{user_id}", request.body.user_id);
        request.headers = {
            "Content-Type":"application/json"
        };

        request.body = {
            "schemas": [
                "urn:ietf:params:scim:api:messages:2.0:PatchOp"
            ],
            "Operations": [
                {
                    "op": "replace",
                    "path": request.body.attributeName,
                    "value": request.body.attributeValue
                }
            ]
        };

        callback(request);
    } catch (e) {
        error(`Error in formatting update user: ${e}`)
    }
}