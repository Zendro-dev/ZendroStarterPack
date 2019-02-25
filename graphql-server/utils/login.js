const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const user = require('../models/index').user

module.exports = {


  /**
   * login - Search for email in users table and returns a webtoken if the password is valid.
   *
   * @param  {String} email    User's email
   * @param  {String} password  User's password
   * @return {String}            Webtoken with user's data encoded
   */
  login: async function({ email, password }) {

    const user_data = await user.findOne({ where: { email } })
    console.log(user_data);
    if (!user_data) {
        throw new Error('No user with that email')
    }

    const valid = (password==user_data.password); //await bcrypt.compare(password, user_data.password)

    if (!valid) {
        throw new Error('Incorrect password')
    }
    const roles = await user_data.getRoles();
    const name_roles = roles.map( x =>{ return x.name })
    console.log("ROLES: ", name_roles);
    // return json web token
    return jsonwebtoken.sign({
        id: user_data.id,
        email: user_data.email,
        roles: name_roles
    }, 'something-secret', { expiresIn: '1h' })
  }

}
