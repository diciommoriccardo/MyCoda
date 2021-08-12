class Errors extends Error {
    constructor(message){
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class ResourceNotFound extends Errors {
    constructor(resource, status) {
        super(`Resource ${resource} was not found.`);
        this.data = { resource, status };
    }
}

export class InternalError extends Errors {
    constructor(resource, status = 500){
        super(`Server Internal Error`);
        this.data = { resource, status };
    }
}