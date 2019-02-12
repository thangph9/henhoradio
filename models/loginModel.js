module.exports = {
  fields: {
    phone: 'text',
    password: 'text',
    password_hash_algorithm: 'text',
    password_salt: 'text',
    user_id: 'uuid',
  },
  key: ['phone', 'user_id'],
};
