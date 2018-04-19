class InvalidMappingError extends Error {
    constructor(...params) {
        super(...params);
        this.name = "InvalidMappingError";
    }
}

class MoveSiteError extends Error {
    constructor(...params) {
        super(...params);
        this.name = "MoveSiteError";
    }
}

export {InvalidMappingError, MoveSiteError}