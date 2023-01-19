import { describe, expect, it } from 'vitest'
import { http } from '../src/index'
describe('http basic use test', async () => {
  it('get', async () => {
    const { data } = await http.get('https://my-json-server.typicode.com/ytton/mock-api/posts/1')
    expect(data).toMatchInlineSnapshot(`
      {
        "id": 1,
        "title": "hello",
      }
    `)
  })
})
