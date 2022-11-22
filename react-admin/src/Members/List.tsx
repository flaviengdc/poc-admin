import { Datagrid, ImageField, List, TextField } from "react-admin";

export const MemberList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ImageField source="Avatar" title="Name" />
      <TextField source="Name" />
    </Datagrid>
  </List>
);
