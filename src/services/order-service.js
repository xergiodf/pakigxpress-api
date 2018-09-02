import pool from '../db'

/**
 * @class OrderService
 */
export default class OrderService {
  /**
   * @member findAll
   */
  async findAll() {
    const orders = await pool.query('select * from orders')
    for (let i = 0; i < orders.length; i++) {
      const client = await pool.query('select * from clients where id = ?', [
        orders[i].client_id
      ])
      orders[i].client = client[0]
    }
    return orders
  }

  /**
   * Find a list of orders based on the client id
   * @param {Integer} id Client ID
   */
  async findByClientId(id) {
    const orders = await pool.query(
      'select * from orders where client_id = ?',
      [id]
    )

    return orders
  }

  /**
   * Creates an order from the user
   * @param {Object} payload
   */
  async addUserOrder(payload) {
    const result = await pool.query('insert into orders SET ?', payload)
    const order = await pool.query('select * from orders where id = ?', [
      result.insertId
    ])

    return {
      id: order[0].id,
      order_id: order[0].order_id,
      client_id: order[0].client_id,
      orig_track_number: order[0].orig_track_number,
      destination: order[0].destination,
      pack_size: order[0].pack_size,
      pack_weight: order[0].pack_weight,
      status: order[0].status,
      est_date_arriv: order[0].est_date_arriv,
      pay_status: order[0].pay_status
    }
  }
}
