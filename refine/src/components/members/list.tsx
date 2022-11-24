import {
  DeleteButton,
  getDefaultSortOrder,
  ImageField,
  List,
  Table,
  TextField,
  useTable,
} from "@pankod/refine-antd";
import { GetListResponse, IResourceComponentsProps } from "@pankod/refine-core";
import { IMember } from "src/interfaces";

export const MemberList: React.FC<
  IResourceComponentsProps<GetListResponse<IMember>>
> = ({ initialData }) => {
  const { tableProps, sorter } = useTable<IMember>({
    queryOptions: {
      initialData,
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="Id"
          key="Id"
          title="Id"
          render={(value) => <TextField value={value} />}
          defaultSortOrder={getDefaultSortOrder("Id", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="Name"
          key="Name"
          title="Avatar"
          render={(value) => <TextField value={value} />}
          defaultSortOrder={getDefaultSortOrder("Name", sorter)}
          sorter
        />
        <Table.Column
          dataIndex="Avatar"
          key="Avatar"
          title="Avatar"
          render={(value) => <ImageField value={value} width={100} />}
          defaultSortOrder={getDefaultSortOrder("Avatar", sorter)}
          sorter
        />
        <Table.Column<IMember>
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <DeleteButton hideText size="small" recordItemId={record.Id} />
          )}
        />
      </Table>
    </List>
  );
};
