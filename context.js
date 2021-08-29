import { createContext, useContext, useReducer } from "react";

const StateContext = createContext({
  searchResults: [],
  items: [],
});

const DispatchContext = createContext(null);

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "GET_RESULTS":
      return {
        ...state,
        searchResults: payload,
      };
    case "LIKE":
      return {
        ...state,
        searchResults: state.searchResults.map((result) =>
          result.id === payload ? { ...result, liked: !result.liked } : result
        ),
      };
    case "BOOK":
      return {
        ...state,
        items: [...state.items, payload],
      };
    case "CANCEL":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== payload),
      };
    default:
      throw new Error(`Unknow action type: ${type}`);
  }
};

export const Provider = ({ children }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    searchResults: [],
    items: [],
  });

  const dispatch = (type, payload) => defaultDispatch({ type, payload });

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useContextState = () => useContext(StateContext);
export const useDispatch = () => useContext(DispatchContext);
