class Errors extends Error {
    constructor(message){
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class ResourceNotFound extends Errors {
    constructor(resource, query) {
        super(`Resource ${resource} was not found.`);
        this.data = { resource, query };
    }
}

export class InternalError extends Errors {
    constructor(resource, query){
        super(`Server Internal Error`);
        this.data = { resource, query };
    }
}