import { useEffect, useState } from 'react';
import {
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Select,
  MenuItem,
  CardHeader,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';

import CustomTable from 'src/components/Table';
import Label from 'src/components/Label';
import { EditTwoTone } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { getTransactionById } from 'src/redux/Order/orderThunk';

const getStatusLabel = (status) => {
  const map = {
    failed: {
      text: 'Failed',
      color: 'error'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    },
    pending: {
      text: 'Pending',
      color: 'warning'
    }
  };

  const { text, color } = map[status];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (cryptoOrders, filters) => {
  return cryptoOrders.filter((cryptoOrder) => {
    let matches = true;

    if (filters.status && cryptoOrder.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const OrdersTable = () => {
  const [selectedCryptoOrders] = useState([]);
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [filters, setFilters] = useState({
    status: null
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTransactionById({ id: 1 }));
  }, []);

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'completed',
      name: 'Completed'
    },
    {
      id: 'pending',
      name: 'Pending'
    },
    {
      id: 'failed',
      name: 'Failed'
    }
  ];

  const columns = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name'
    },
    {
      id: 'age',
      header: 'Age',
      accessor: 'age'
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      cell: ({ value }) => {
        return getStatusLabel(value);
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: 'actions',
      cell: () => {
        return (
          <Stack spacing={1} direction="row">
            <Tooltip title="Edit Order" arrow>
              <IconButton color="primary">
                <EditTwoTone fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      }
    }
  ];
  const data = [
    { name: 'John Doe', age: 25, status: 'completed' },
    { name: 'Jane Doe', age: 30, status: 'pending' }
    // Add more data rows as needed
  ];
  const handleStatusChange = (e) => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const filteredCryptoOrders = applyFilters(data, filters);

  return (
    <Card>
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Order List"
        />
      )}
      <Divider />
      <CustomTable columns={columns} data={filteredCryptoOrders} />
    </Card>
  );
};

export default OrdersTable;
