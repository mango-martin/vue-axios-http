import Axios from 'axios'
import BaseProxy from '../core/BaseProxy'
import MockAdapter from 'axios-mock-adapter'
import PostProxy from '../core/PostPorxy'
import Validator from '../core/Validator'

let proxy: PostProxy
let mockAdapter
let validator: Validator

describe('BaseProxy', () => {
  beforeEach(() => {
    validator = new Validator()
    const axios = Axios.create()
    BaseProxy.$http = axios
    proxy = new PostProxy()
    mockAdapter = new MockAdapter(axios)
  })
  it('will fetch all records', async () => {
    const items = [{ first_name: 'Chantouch', last_name: 'Sek' }]
    mockAdapter.onGet('/posts').reply(200, { data: items })
    try {
      const { data } = await proxy.all()
      expect(data).toEqual(items)
    } catch (e) {
      console.log('all:', e)
    }
  })

  it('will fetch all records with query params', async () => {
    const items = [
      { first_name: 'Dara', last_name: 'Hok', id: 1 },
      { first_name: 'Chantouch', last_name: 'Sek', id: 2 },
    ]
    mockAdapter.onGet('/posts?id=1&first_name=Dara').reply(200, { data: items })
    try {
      const { data } = await proxy
        .setParameter('id', 1)
        .setParameters({ first_name: 'Dara' })
        .all()
      expect(data).toEqual(items)
    } catch (e) {
      console.log('all params:', e)
    }
  })
  it('it should be able to remove parameter(s)', async () => {
    const items = [
      { first_name: 'Dara', last_name: 'Hok', id: 1 },
      { first_name: 'Chantouch', last_name: 'Sek', id: 2 },
    ]
    mockAdapter.onGet('/posts?id=1').reply(200, { data: items })
    try {
      const { data } = await proxy
        .setParameter('id', 1)
        .setParameters({ first_name: 'Dara' })
        .setParameters({ last_name: 'Sek' })
        .removeParameter('first_name')
        .removeParameters(['first_name', 'last_name'])
        .all()
      expect(data).toEqual(items)
    } catch (e) {
      console.log('all params:', e)
    }
  })

  it('it should find an item by id', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onGet('/posts/' + 1).reply(200, { data: item })
    try {
      const { data } = await proxy.find(1)
      expect(data).toEqual(item)
    } catch (e) {
      console.log('find:', e)
    }
  })

  it('it should find an item by id', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPost('/posts').reply(201, { data: item })
    try {
      const { data } = await proxy.post(item)
      expect(data).toEqual(item)
    } catch (e) {
      console.log('post:', e)
    }
  })

  it('it should throw errors message when data is not valid', async () => {
    const item = { first_name: null, last_name: 'Sek', id: 1 }
    mockAdapter.onPost('/posts').reply(422, {
      errors: { first_name: ['The first name field is required'] },
    })
    try {
      await proxy.post(item)
    } catch (e) {
      console.log('post:', e)
    }
    console.log('Error: ', validator.any())
    expect(validator.has('first_name')).toBeTruthy()
  })

  it('it should store the item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPost('/posts').reply(201, { data: item })
    try {
      const { data } = await proxy.store(item)
      expect(data).toEqual(item)
    } catch (e) {
      console.log('store:', e)
    }
  })

  it('it should be able to put item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPut('/posts/' + 1).reply(200, { data: item })
    try {
      const { data } = await proxy.put(item.id, item)
      expect(data).toEqual(item)
    } catch (e) {
      console.log('put:', e)
    }
  })

  it('it should be able to patch item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onPatch('/posts/' + 1).reply(200, { data: item })
    try {
      const { data } = await proxy.patch(item.id, item)
      expect(data).toEqual(item)
    } catch (e) {
      console.log('patch:', e)
    }
  })

  it('it should be able to patch item', async () => {
    const item = { first_name: 'Chantouch', last_name: 'Sek', id: 1 }
    mockAdapter.onDelete('/posts/' + 1).reply(200, { data: item })
    try {
      const { data } = await proxy.delete(item.id)
      expect(data).toEqual(item)
    } catch (e) {
      console.log('delete:', e)
    }
  })
})
