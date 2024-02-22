import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "./store";
import { Store } from "redux";

interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store as Store}>
      {children}
    </Provider>
  );
};

export default ReduxProvider;
