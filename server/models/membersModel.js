module.exports = {
  fields: {
    membersid: 'uuid',
    ucode: 'int',
    gcode: 'int',
    name: 'text',
    day: 'int',
    month: 'int',
    year: 'int',
    audio: 'uuid',
    location: 'text',
    description: {
      type: 'map',
      typeDef: '<text,text>',
    },
    prefix: 'text',
    job: 'text',
    relationship: 'text',
    address: 'text',
    mobile: 'text',
    gender: 'text',
    timeup: 'timestamp',
    createby: 'text',
    created: {
      type: 'timestamp',
      default: { $db_function: 'toTimestamp(now())' },
    },
  },
  key: [['membersid'], 'created'],
  clustering_order: { created: 'desc' },
  materialized_views: {
    view_member: {
      select: [
        'membersid',
        'ucode',
        'gcode',
        'name',
        'day',
        'month',
        'year',
        'audio',
        'location',
        'description',
        'job',
        'relationship',
        'address',
        'mobile',
        'gender',
        'timeup',
      ],
      key: ['membersid', 'created'],
    },
  },
  options: {
    timestamps: {
      createdAt: 'created_at', // defaults to createdAt
      updatedAt: 'updated_at', // defaults to updatedAt
    },
    versions: {
      key: '__v', // defaults to __v
    },
  },
};
