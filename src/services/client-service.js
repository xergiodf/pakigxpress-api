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
}
