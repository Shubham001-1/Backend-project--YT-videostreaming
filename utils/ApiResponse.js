class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message; // Fixed typo from 'this,message' to 'this.message'
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
