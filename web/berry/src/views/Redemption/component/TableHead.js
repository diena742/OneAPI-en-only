import { TableCell, TableHead, TableRow } from '@mui/material';

const RedemptionTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Quota</TableCell>
        <TableCell>Created Time</TableCell>
        <TableCell>Redeemed Time</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default RedemptionTableHead;
