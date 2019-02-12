module.exports = {
  fields: {
    image_id: 'uuid',
    description: 'text',
    face_active: 'boolean',
    image: 'blob',
    options: {
      type: 'map',
      typeDef: '<text,text>',
    },
  },
  key: ['image_id'],
};
