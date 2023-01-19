import axios from 'axios'
import defaultConfig from './defaultConfig'
import { handleConfig, handleInterceptors, handleMethod } from './handles'
import type { YtRequestConfig, YtRequestInstance, YtRequestStatic } from './types'
function createInstance(config: YtRequestConfig): YtRequestInstance {
  handleConfig(config)
  const instance = axios.create(config)
  handleInterceptors(instance)
  handleMethod(instance)
  return instance
}
const request = createInstance({ ...defaultConfig })
const staticInstance: YtRequestStatic = {
  ...request,
  ...{
    create(config) {
      return createInstance({ ...defaultConfig, ...config })
    },
  },
}

export default staticInstance
export { staticInstance as http }
