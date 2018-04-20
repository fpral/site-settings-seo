class InvalidMappingError extends Error {
    constructor(invalidMappings, ...params) {
        super(...params);

        this.name = "InvalidMappingError";
        this.invalidMappings = invalidMappings;
    }
}

class MoveSiteError extends Error {
    constructor(...params) {
        super(...params);
        this.name = "MoveSiteError";
    }
}

export {InvalidMappingError, MoveSiteError}