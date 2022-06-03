const axios = require("axios");

module.exports = function(input, callback, error){
     let {
        request,
        secrets
    } = input;

    const BamboohrClient = axios.create({
        baseURL: `https://api.bamboohr.com/api/gateway.php/${secrets.subdomain}/v1`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${secrets.apiKey}==`
        }
    });

    // Request a report of users workEmails and ids
    BamboohrClient.post(
        `/reports/custom`,
        null
        ,
        {
            params:{
                format:"JSON",
                onlyCurrent:true
            },
            data:{
                "fields":["workEmail","id"]
            }
        }
    ).then( report => {
        // Standardize emails then filter out profiles that match our provided email
        const refEmail = request.body.workEmail.toLowerCase();

        const matchingEmployees = report.data.employees.filter(user => {
            const usrEmail = user.workEmail?.toLowerCase();
            return (usrEmail === refEmail);
        });

        const numberOfMatches = matchingEmployees.length;

        const userId = numberOfMatches === 1 ?
            matchingEmployees[0].id :
            numberOfMatches < 0 ?
                error(`No employees found with email: ${refEmail}`) :
                error(`More than one employee found with email: ${refEmail}`);



        request.url = request.url.replace(/{id}/g,userId);

        for(let key in request.body) {
            if( key !== "workEmail"){
                if (request.body[key] === undefined){
                    delete request.body[key]
                }
            }
        }

        callback(request);
    });
}
