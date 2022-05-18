const axios = require("axios");

const getBranchId = async (branchName, secrets, auth, error) => {
    try {
        const getBranchesRequest = {
            url: `https://${secrets.domain}.docebosaas.com/manage/v1/orgchart`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": auth
            }
        };

        const response = await axios(getBranchesRequest);
        const branches = response.data.data.items.filter(branch => branchName.toLowerCase().trim() === branch.title.toLowerCase().trim());

        if (branches.length > 1) {
            error(`More than 1 branch was found with name ${branchName}`);
        } else if (branches.length === 0) {
            error(`No branches found with name ${branchName}`);
        } else {
            return branches[0].id;
        }
    } catch (err) {
        error(`Failed to get Branch Id for name ${branchName}: ${err}`);
    }
};

module.exports = async (input, callback, error) => {
    try {
        let request = input.request;
        const branchId = await getBranchId(request.body.branchName, input.secrets, request.headers.Authorization, error);
        request.body["select_orgchart"] = {};
        request.body["select_orgchart"][branchId] = 1;
        delete request.body.branchName;
        callback(request);
    } catch (err) {
        error(`getBranchId Pre Request failed: ${err}`)
    }
};
