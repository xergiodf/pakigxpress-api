import boom from 'boom'
import jwt from 'jsonwebtoken'
import uuidv4 from 'uuid/v4'
import pool from '../db'
import { comparePasswords, hashPassword } from '../helpers/password'

const USERS_BY_EMAIL = 'select * from users where email = ?'
const USERS_BY_ID = 'select * from users where id = ?'
const CLIENTS_BY_USERID = 'select * from clients where user_id = ?'

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
    const user = await pool.query(USERS_BY_ID, [id])
    const client = await pool.query(CLIENTS_BY_USERID, [id])

    user.client = client[0]
    return user
  }

  /**
   *
   * @param {String} email
   * @param {String} password
   */
  async authUser(email, password) {
    const user = await pool.query(USERS_BY_EMAIL, [email])

    if (!Array.isArray(user) || !user.length) {
      throw boom.notFound('User not found')
    }

    const compare = await comparePasswords(password, user[0].password)
    if (!compare) throw boom.badData('Invalid credentials')

    const client = await pool.query(CLIENTS_BY_USERID, [user[0].id])

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
    const userQuery = await pool.query(USERS_BY_EMAIL, [payload.email])

    if (!Array.isArray(userQuery) || !userQuery.length) {
      payload.password = await hashPassword(payload.password)

      const result = await pool.query('insert into users SET ?', payload)

      const user = await pool.query(USERS_BY_ID, [result.insertId])

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

  /**
   * Creates a new reset password token
   * @param {String} email User email
   */
  async forgotPassword(email) {
    // Check if email not empty
    if (!email) throw boom.badRequest('You should provide a valid email')

    // Verify email existence
    const user = await pool.query(USERS_BY_EMAIL, [email])

    if (!Array.isArray(user) || !user.length) {
      throw boom.notFound('User not found')
    }

    // Create the token
    const token = uuidv4()

    // Update the user
    await pool.query('update users set pass_reset_token = ? where id =?', [
      token,
      user[0].id
    ])

    return {
      token,
      customerName: user[0].full_name,
      customerEmail: user[0].email
    }
  }

  /**
   * Checks the validity of a token and perform a password change if it's valid
   * @param {String} token Verify key to perfom the reset password action
   * @param {String} newPassword New password to be changed to
   */
  async resetPassword(token, newPassword) {
    if (
      !token ||
      !newPassword ||
      ((token && token.length === 0) ||
        (newPassword && newPassword.length === 0))
    )
      throw boom.badRequest('Token and newPassword are required')

    // Verify token
    const user = await pool.query(
      'select * from users where pass_reset_token = ?',
      [token]
    )

    if (!Array.isArray(user) || !user.length) {
      throw boom.notFound('Invalid token')
    }

    // Perform pass change
    const hashedPassword = await hashPassword(newPassword)

    await pool.query(
      'update users set password = ?, pass_reset_token = null where id =?',
      [hashedPassword, user[0].id]
    )
  }
}
