import { PostCreate, PostEdit, PostList, PostShow } from "@components/posts";
import {
  ErrorComponent,
  Layout,
  notificationProvider,
  ReadyPage,
} from "@pankod/refine-antd";
import "@pankod/refine-antd/dist/styles.min.css";
import { Refine } from "@pankod/refine-core";
import routerProvider from "@pankod/refine-nextjs-router";
import { AppProps } from "next/app";
import dataProvider from "../src/dataProvider";

const API_URL = "https://api.fake-rest.refine.dev";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider(API_URL)}
      notificationProvider={notificationProvider}
      Layout={Layout}
      ReadyPage={ReadyPage}
      catchAll={<ErrorComponent />}
      resources={[
        {
          name: "posts",
          list: PostList,
          create: PostCreate,
          edit: PostEdit,
          show: PostShow,
        },
      ]}
    >
      <Component {...pageProps} />
    </Refine>
  );
}

export default MyApp;
