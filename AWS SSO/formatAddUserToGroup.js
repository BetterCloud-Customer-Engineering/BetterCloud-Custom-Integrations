module.exports = async (input, callback, error) => {
    try{
        let request = input.request;
        let url = input.request.url;


        request.url = url.replace("{group_id}", request.body.group_id);
        request.headers = {
            "Content-Type":"application/json"
        };
        request.data = {
            "schemas":[
                "urn:ietf:params:scim:api:messages:2.0:PatchOp"
            ],
            "Operations":[
                {
                    "op":"add",
                    "path":"members",
                    "value":[
                        {
                            "value":request.body.user_id
                        }
                    ]
                }
            ]
        };

        delete request.body;

        callback(request);
    } catch (e) {
        error(`Error in formatting add user to group: ${e}`)
    }
}