module.exports = {
  fields: {
    image_id: 'uuid',
    description: 'text',
    createat: 'timestamp',
    face_active: 'boolean',
    image: 'blob',
    options: {
      type: 'map',
      typeDef: '<text,text>',
    },
  },
  key: ['image_id'],
};
