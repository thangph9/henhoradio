module.exports = {
  fields: {
    phone: 'text',
    password: 'text',
    password_hash_algorithm: 'text',
    password_salt: 'text',
    user_id: {
      type: 'uuid',
      default: { $db_function: 'uuid()' },
    },
  },
  key: ['phone', 'user_id'],
};
