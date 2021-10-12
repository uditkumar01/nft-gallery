export function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_ETH_ADDRESS":
      return {
        ...state,
        user: {
          ...state.user,
          ethAddresses: [...state.user.ethAddresses, action.payload],
        },
      };
    case "SET_TEZOS_ADDRESS":
      return {
        ...state,
        user: {
          ...state.user,
          tezosAddresses: [...state.user.tezosAddresses, action.payload],
        },
      };
    default:
      return state;
  }
}
