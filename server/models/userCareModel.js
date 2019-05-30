module.exports = {
  fields: {
    user_id1: {
      type: 'uuid',
      default: { $db_function: 'uuid()' },
    },
    user_id2: {
      type: 'uuid',
      default: { $db_function: 'uuid()' },
    },
    type: {
      type: 'text',
    },
    created: {
      type: 'timestamp',
      default: { $db_function: 'toTimestamp(now())' },
    },
  },
  key: [['user_id1', 'user_id2'], 'created'],
  clustering_order: { created: 'desc' },
};
