import { MemberList } from "@components/members/list";
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

const API_URL = "http://localhost:8080/api/v1/db/data/v1/gdc-admin-poc";

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
          name: "Members",
          list: MemberList,
        },
      ]}
    >
      <Component {...pageProps} />
    </Refine>
  );
}

export default MyApp;
