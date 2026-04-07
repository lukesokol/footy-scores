export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface ApiSuccess<T> {
  readonly status: 'success'
  readonly data: T
}

export interface ApiError {
  readonly status: 'error'
  readonly error: string
}

export type ApiResult<T> = ApiSuccess<T> | ApiError
