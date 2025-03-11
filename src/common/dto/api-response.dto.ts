export class ApiErrorResponseDTO {
    constructor(
        public readonly errorCode: string,
        public readonly message: string
    ) {}
}

export class ApiResponseDTO<T> {
    constructor(
        public readonly data: T | null,
        public readonly error: ApiErrorResponseDTO | null
    ) {}

    static success<T>(data: T): ApiResponseDTO<T> {
        return new ApiResponseDTO<T>(data, null);
    }

    static error<T>(errorCode: string, message: string): ApiResponseDTO<T> {
        const error = new ApiErrorResponseDTO(errorCode, message);
        return new ApiResponseDTO<T>(null, error);
    }
}
