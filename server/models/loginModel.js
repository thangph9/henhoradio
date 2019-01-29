module.exports = {
  fields: {
    user_id: 'uuid',
    address: 'text',
    email: 'text',
    createat: 'timestamp',
    last_login: 'timestamp',
    name: 'text',
    phone: 'text',
    role: {
      type: 'set',
      typeDef: 'text',
    },
    updateat: 'timestamp',
    username: 'text',
  },
  key: ['user_id'],
};
