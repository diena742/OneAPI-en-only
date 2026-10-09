import { TableCell, TableHead, TableRow } from '@mui/material';

const ChannelTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Group</TableCell>
        <TableCell>Type</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Response Time</TableCell>
        <TableCell>Consumed</TableCell>
        <TableCell>Balance</TableCell>
        <TableCell>Priority</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ChannelTableHead;
