import boom from 'boom'
import pool from '../db'

/**
 * @class ClientService
 */
export default class ClientService {
  /**
   * @member findAll
   */
  async findAll() {
    const clients = await pool.query('select * from clients')
    console.log(clients)
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].user_id !== null) {
        const user = await pool.query('select * from users where id = ? ', [
          clients[i].user_id
        ])
        clients[i].user = user[0]
      }
    }
    return clients
  }

  /**
   * @member registerClient
   * @param {Object} payload
   */
  async registerClient(payload) {
    const clientQuery = await pool.query(
      'select * from clients where user_id = ?',
      [payload.userId]
    )

    if (!Array.isArray(clientQuery) || !clientQuery.length) {
      const result = await pool.query('insert into clients set ?', payload)
      const client = await pool.query('select * from clients where id = ?', [
        result.insertId
      ])

      return {
        id: client[0].id,
        fullName: client[0].full_name,
        phone: client[0].phone,
        addressOne: client[0].address_1,
        addressTwo: client[0].address_2,
        city: client[0].city,
        state: client[0].state,
        zip: client[0].zip
      }
    } else {
      throw boom.conflict('User assigned to a different client')
    }
  }

  /**
   * @member updateClient
   * @param {Object} payload
   */
  async updateClient(payload) {
    await pool.query(
      'update clients set full_name = ?, phone = ?, address_1 = ?, address_2 = ?, city = ?, state = ?, zip = ? where id = ?',
      [
        payload.full_name,
        payload.phone,
        payload.address_1,
        payload.address_2,
        payload.city,
        payload.state,
        payload.zip,
        payload.id
      ]
    )

    const client = await pool.query('select * from clients where id = ?', [
      payload.id
    ])

    return {
      id: client[0].id,
      full_name: client[0].full_name,
      phone: client[0].phone,
      address_1: client[0].address_1,
      address_2: client[0].address_2,
      city: client[0].city,
      state: client[0].state,
      zip: client[0].zip
    }
  }
}
