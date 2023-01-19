import type { AxiosDefaults, AxiosError, AxiosHeaders, AxiosResponseHeaders, CreateAxiosDefaults, HeadersDefaults, RawAxiosResponseHeaders } from 'axios'

export interface ExtraConfig<T = any, D = any> {
  needAuth: boolean
  needMessage: boolean
  message: Message
  returnType: 'promise' | 'withError'
  __isMethod: boolean
  handleAuth: (config: YtRequestConfig<D>) => YtRequestConfig<D>
  handleRequest: (config: YtRequestConfig<D>) => YtRequestConfig<D>
  handleMethodRequest: (config: YtRequestConfig<D>) => YtRequestConfig<D>
  handleResponse: (response: YtResponse<T, D>) => YtResponse<D>
  handleMethodResponse: (response: T) => T
  handleError: (error: AxiosError) => Promise<any>
}
export type YtRequestConfig<D = any, T = any> = CreateAxiosDefaults<D> & Partial<ExtraConfig<T, D>>
export interface YtResponse<T = any, D = any> {
  data: T
  status: number
  statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
  config: YtRequestConfig<D>
  request?: any
}
export interface YtRequestInstance {
  request<T = any, R = YtResponse<T>, D = any>(config: YtRequestConfig<D, R>): Promise<R>
  get<T = any, R = YtResponse<T>, D = any>(url: string, config?: YtRequestConfig<D, R>): Promise<R>
  delete<T = any, R = YtResponse<T>, D = any>(url: string, config?: YtRequestConfig<D, R>): Promise<R>
  head<T = any, R = YtResponse<T>, D = any>(url: string, config?: YtRequestConfig<D, R>): Promise<R>
  options<T = any, R = YtResponse<T>, D = any>(url: string, config?: YtRequestConfig<D, R>): Promise<R>
  post<T = any, R = YtResponse<T>, D = any>(url: string, data?: D, config?: YtRequestConfig<D, R>): Promise<R>
  put<T = any, R = YtResponse<T>, D = any>(url: string, data?: D, config?: YtRequestConfig<D, R>): Promise<R>
  patch<T = any, R = YtResponse<T>, D = any>(url: string, data?: D, config?: YtRequestConfig<D, R>): Promise<R>
  postForm<T = any, R = YtResponse<T>, D = any>(url: string, data?: D, config?: YtRequestConfig<D, R>): Promise<R>
  putForm<T = any, R = YtResponse<T>, D = any>(url: string, data?: D, config?: YtRequestConfig<D, R>): Promise<R>
  patchForm<T = any, R = YtResponse<T>, D = any>(url: string, data?: D, config?: YtRequestConfig<D, R>): Promise<R>
  defaults: Omit<AxiosDefaults, 'headers'> & {
    headers: HeadersDefaults & {
      [key: string]: AxiosHeaders | string | string[] | number | boolean | null
    }
  }
}
export interface YtRequestStatic extends YtRequestInstance {
  create(config: YtRequestConfig): YtRequestInstance
}
export interface Message {
  (message: string): void
  (messageType: { type: 'success' | 'info' | 'warning' | 'error'; message: string }): void
  success(message: string): void
  info(message: string): void
  warning(message: string): void
  error(message: string): void
}
