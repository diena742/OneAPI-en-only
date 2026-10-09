import { TableCell, TableHead, TableRow } from '@mui/material';

const UsersTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Username</TableCell>
        <TableCell>Group</TableCell>
        <TableCell>Statistics</TableCell>
        <TableCell>Role</TableCell>
        <TableCell>Binding</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default UsersTableHead;
