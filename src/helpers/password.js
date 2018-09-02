import bcrypt from 'bcrypt'

const comparePasswords = (payload, pass) =>
  new Promise((resolve, reject) =>
    bcrypt
      .compare(payload, pass)
      .then(res => resolve(res))
      .catch(e => reject(e))
  )

const hashPassword = payload =>
  new Promise((resolve, reject) =>
    bcrypt.hash(payload, 10, (err, hash) => (err ? reject(err) : resolve(hash)))
  )

export { comparePasswords, hashPassword }
