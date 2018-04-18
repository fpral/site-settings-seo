class InvalidMappingError extends Error {
    constructor(...params) {
        super(...params);
        this.name = "InvalidMappingError";
    }
}

export {InvalidMappingError}