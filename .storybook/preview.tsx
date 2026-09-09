import React from "react";
import type { Preview } from "@storybook/nextjs-vite";
import { mswLoader } from "msw-storybook-addon/csf3";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { transactionsApi } from "../lib/api/services/transactions";

import "../app/globals.css";

const createStore = () =>
  configureStore({
    reducer: { [transactionsApi.reducerPath]: transactionsApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(transactionsApi.middleware),
  });

const ReduxDecorator = (Story: any) => {
  const store = React.useMemo(() => createStore(), []);
  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};

const preview: Preview = {
  decorators: [ReduxDecorator],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    layout: "fullscreen",

    a11y: {
      test: "todo",
    },
  },
  loaders: [mswLoader()],
};

export default preview;
