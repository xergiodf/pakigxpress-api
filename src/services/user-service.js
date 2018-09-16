import boom from 'boom'
import jwt from 'jsonwebtoken'
import pool from '../db'
import { comparePasswords, hashPassword } from '../helpers/password'

/**
 * @class UserService
 */
export default class UserService {
  /**
   * @member findAll
   */
  async findAll() {
    const users = await pool.query('select * from users')
    return users
  }

  /**
   *
   * @param {Integer} id
   */
  async findById(id) {
    const user = await pool.query('select * from users where id = ?', [id])
    const client = await pool.query('select * from clients where user_id = ?', [
      id
    ])

    user.client = client[0]
    return user
  }

  /**
   *
   * @param {String} email
   * @param {String} password
   */
  async authUser(email, password) {
    const user = await pool.query('select * from users where email = ?', [
      email
    ])

    if (!Array.isArray(user) || !user.length) {
      throw boom.notFound('User not found')
    }

    const compare = await comparePasswords(password, user[0].password)
    if (!compare) throw boom.badData('Invalid credentials')

    const client = await pool.query('select * from clients where user_id = ?', [
      user[0].id
    ])

    return {
      id: user[0].id,
      full_name: user[0].full_name,
      email: user[0].email,
      role: user[0].role,
      token: jwt.sign(
        {
          id: user[0].id,
          full_name: user[0].full_name,
          email: user[0].email,
          role: user[0].role,
          client: client[0]
        },
        'pakixpress'
      ),
      client: client[0]
    }
  }

  /**
   *
   * @param {Object} payload
   */
  async registerUser(payload) {
    const userQuery = await pool.query('select * from users where email = ?', [
      payload.email
    ])

    if (!Array.isArray(userQuery) || !userQuery.length) {
      payload.password = await hashPassword(payload.password)

      const result = await pool.query('insert into users SET ?', payload)

      const user = await pool.query('select * from users where id = ?', [
        result.insertId
      ])

      return {
        id: user[0].id,
        full_name: user[0].full_name,
        email: user[0].email,
        role: user[0].role
      }
    } else {
      throw boom.conflict('Email already taken')
    }
  }
}
