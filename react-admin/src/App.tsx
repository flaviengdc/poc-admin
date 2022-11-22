// import jsonServerProvider from "ra-data-json-server";
import { Admin, Resource } from "react-admin";

import dataProvider from "./DataProvider";
import { MemberList } from "./Members/List";

const App = () => (
  <Admin
    dataProvider={dataProvider(
      "http://localhost:8080/api/v1/db/data/v1/gdc-admin-poc"
    )}
  >
    <Resource name="Members" list={MemberList} />
  </Admin>
);

export default App;
