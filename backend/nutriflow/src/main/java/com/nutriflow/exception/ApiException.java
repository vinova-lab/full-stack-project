package com.nutriflow.exception;

import org.springframework.http.HttpStatus;

/** Base class for errors the service layer raises; the controller advice maps them to HTTP. */
public abstract class ApiException extends RuntimeException {

    private final HttpStatus status;

    protected ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
