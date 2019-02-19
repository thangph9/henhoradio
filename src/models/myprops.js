export default {
  namespace: 'myprops',

  state: {
    menu_header: false,
  },

  effects: {},

  reducers: {
    menu_header(state, action) {
      return {
        ...state,
        menu_header: action.payload,
      };
    },
  },
};
