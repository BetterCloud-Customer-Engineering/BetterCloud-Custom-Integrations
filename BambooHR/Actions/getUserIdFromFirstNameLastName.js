const axios = require("axios");
let errorCallback;

const getUserIdFromFirstNameLastName = async (secrets, request) => {
    try {
        const getReport = {
            method: "POST",
            url: `https://api.bamboohr.com/api/gateway.php/${secrets.subdomain}/v1/reports/custom?format=JSON&onlyCurrent=true`,
            headers: {
                "Content-Type":"application/json",
                "Authorization": request.headers.Authorization
            },
            data: {
                "fields": ["firstName", "lastName", "id"]
            }
        }

        const report = await axios(getReport);

        const firstName = request.body.firstName.toLowerCase();
        const lastName = request.body.lastName.toLowerCase();

        const matchingEmployees = report.data.employees.filter(user => {
            const usrFirstName = user.firstName?.toLowerCase();
            const usrLastName = user.lastName?.toLowerCase();

            const match = usrFirstName === firstName && usrLastName === lastName;
            return (match);
        });

        const numberOfMatches = matchingEmployees.length;

        if (numberOfMatches === 1) return (matchingEmployees[0].id);
        if (numberOfMatches > 1) errorCallback(`More than one employee found with name: ${request.body.firstName} ${request.body.lastName} on tenant ${secrets.subdomain}.`);
        if (numberOfMatches < 1) errorCallback(`No employees found with name: ${request.body.firstName} ${request.body.lastName} on tenant ${secrets.subdomain}.`);
    } catch (e) {
        errorCallback(`Error getting userId with name: ${request.body.firstName} ${request.body.lastName} on tenant ${secrets.subdomain}. Error: ${e}`);
    }
}

module.exports = async (input, callback, error) => {
    // Global Variables
    errorCallback = error;

    try {
        // Scoped Variables
        const secrets = input.secrets;
        let request = input.request;

        // Get userId via firstName lastName search
        const userId = await getUserIdFromFirstNameLastName(secrets, request);
        request.body.userId = userId;

        callback(request);

    } catch (e) {
        error(`Error in OAuth pre-request module.exports function. Error: ${e}`);
    }
}
