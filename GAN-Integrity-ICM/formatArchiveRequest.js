/**
 *
 * @param input
 * @param callback
 * @param error
 * @returns {Promise<void>}
 */
module.exports = async (input, callback, error) => {
    try {
        // Globals: BetterCloud related
        // > None required

        // Scoped: Request related
        // > None required

        // Calls
        // > None required

        // Request Modification
        input.request.body.Archived = false;
        delete input.request.body.email;

        // Handoff
        callback(input.request);
    } catch (err) {
        error(`Error in formatArchiveRequest pre-request module.exports function. Error: ${err}`);
    }
};