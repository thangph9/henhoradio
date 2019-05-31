module.exports = {
  fields: {
    phone: 'text', // unicode
    user_id: {
      type: 'uuid',
      default: { $db_function: 'uuid()' },
    },
    password: 'text',
    password_hash_algorithm: 'text',
    password_salt: 'text',
    rule: {
      type: 'set',
      typeDef: '<text>',
    },
    status: 'text',
  },
  key: ['phone', 'user_id'],
};
