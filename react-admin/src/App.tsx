// import jsonServerProvider from "ra-data-json-server";
import { Admin, ListGuesser, Resource } from "react-admin";

import dataProvider from "./DataProvider";

const App = () => (
  <Admin
    dataProvider={dataProvider(
      "http://localhost:8080/api/v1/db/data/v1/gdc-admin-poc"
    )}
  >
    <Resource name="Members" list={ListGuesser} />
  </Admin>
);

export default App;
