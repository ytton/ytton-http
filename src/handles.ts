import { cloneDeep } from 'lodash-es'
import defaultConfig from './defaultConfig'
export function handleMessage(errorPromise: any, extra: any) {
  const { needMessage, message, returnType } = extra ?? {}
  return new Promise((resolve, reject) => {
    errorPromise.then(resolve, (error: any) => {
      let msg = ''
      if (typeof error === 'string')
        msg = error

      else if (typeof error === 'object' && 'message' in error)
        msg = error.message

      needMessage && message.error(msg)
      if (returnType === 'withError')
        return resolve([error, undefined])

      reject(error)
    })
  })
}
export function formatKey(key: string, isMethod: boolean) {
  if (key.startsWith('handle'))
    return `handle${isMethod ? 'Method' : ''}${key.replace('handle', '')}`

  return key
}
export function handleConfig(config: any) {
  config.extra = {}
  Object.keys(defaultConfig).forEach((extraKey) => {
    if (extraKey in config) {
      config.extra[formatKey(extraKey, config.__isMethod)] = config[extraKey]
      delete config[extraKey]
    }
  })
  config.__isMethod && delete config.__isMethod
}
export function handleInterceptors(instance: any) {
  instance.interceptors.request.use(
    (config: any) => {
      const extra = { ...instance.defaults.extra, ...(config.extra ?? defaultConfig) }
      try {
        // 全局统一处理请求
        // 拷贝一份全局处理之前
        const beforeConfig = cloneDeep(config)
        config = extra.handleRequest(config) ?? config
        // 方法局部处理请求
        config = extra.handleMethodRequest(config, beforeConfig) ?? config
        // 处理token
        extra.needToken && (config = extra.handleAuth(config) ?? config)
        return config
      }
      catch (error) {
        return handleMessage(extra.handleError(error, config), extra)
      }
    },
    (error: any) => {
      const extra = error?.config?.extra ?? {}
      const errorPromise = extra ? extra.handleError(error) : Promise.reject(error)
      return handleMessage(errorPromise, extra)
    },
  )

  instance.interceptors.response.use(
    (response: any) => {
      const extra = { ...instance.defaults.extra, ...(response.config.extra ?? defaultConfig) }
      try {
        // 全局统一处理响应
        // 拷贝一份全局处理前的response
        const beforeResponse = cloneDeep(response)
        response = extra.handleResponse(response) ?? response
        // 方法局部处理响应
        response = extra.handleMethodResponse(response, beforeResponse) ?? response
        if (extra.returnType === 'withError')
          response = [undefined, response]

        return response
      }
      catch (error) {
        return handleMessage(extra.handleError(error, response), extra)
      }
    },
    (error: any) => {
      const extra = error?.config?.extra
      const errorPromise = extra ? extra.handleError(error) : Promise.reject(error)
      return handleMessage(errorPromise, extra)
    },
  )
}
export function handleMethod(instance: any) {
  const _request = instance.request
  function request(configOrUrl: any, config: any) {
    if (typeof configOrUrl === 'string') {
      config = config || {}
      config.url = configOrUrl
    }
    else {
      config = configOrUrl || {}
    }
    config.__isMethod = true
    handleConfig(config)
    return _request.call(instance, config)
  }
  instance.request = request;

  ['delete', 'get', 'head', 'options'].forEach((method) => {
    instance[method] = function (url: any, config: any) {
      return this.request({
        ...(config || {}),
        ...{
          method,
          url,
          data: (config || {}).data,
        },
      })
    }
  });

  ['post', 'put', 'patch'].forEach((method) => {
    function generateHTTPMethod(isForm = false) {
      return function httpMethod(url: any, data: any, config: any) {
        return instance.request({
          ...(config || {}),
          ...{
            method,
            headers: isForm
              ? {
                  'Content-Type': 'multipart/form-data',
                }
              : {},
            url,
            data,
          },
        })
      }
    }

    instance[method] = generateHTTPMethod()

    instance[`${method}Form`] = generateHTTPMethod(true)
  })
}

