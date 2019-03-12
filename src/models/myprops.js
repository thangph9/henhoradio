export default {
  namespace: 'myprops',

  state: {
    menu_header: false,
    menu_header_mobile: false,
    menu_item_profile: 0,
  },

  effects: {},

  reducers: {
    menu_header(state, action) {
      return {
        ...state,
        menu_header: action.payload,
      };
    },
    menu_header_mobile(state, action) {
      return {
        ...state,
        menu_header_mobile: action.payload,
      };
    },
    menu_item_profile(state, action) {
      return {
        ...state,
        menu_item_profile: action.payload,
      };
    },
  },
};
