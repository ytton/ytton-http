import type { AxiosError } from 'axios'
import type { YtRequestConfig, YtResponse } from './types'

function handleAuth<D>(config: YtRequestConfig<D>) {
  return config
}
function handleRequest<D>(config: YtRequestConfig<D>) {
  return config
}
function handleMethodRequest<D>(config: YtRequestConfig<D>) {
  return config
}
function handleResponse(response: YtResponse) {
  return response
}
function handleMethodResponse(response: YtResponse) {
  return response
}
function handleError(error: AxiosError): Promise<any> {
  return Promise.reject(error)
}
function console(message: string | { type: 'success' | 'info' | 'warning' | 'error'; message: string }) {
  if (typeof message === 'string')
    console.info(message)

  else
    console[message.type](message.message)
}
console.info = (message: string) => console({ type: 'info', message })
console.success = (message: string) => console({ type: 'success', message })
console.error = (message: string) => console({ type: 'error', message })
console.warning = (message: string) => console({ type: 'warning', message })

export const defaultConfig = {
  needAuth: false,
  needMessage: false,
  message: console,
  returnType: 'promise' as const, // 'withError'
  handleAuth,
  handleRequest,
  handleMethodRequest,
  handleResponse,
  handleMethodResponse,
  handleError,
}
export default defaultConfig
