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
  Stack,
  Button
} from '@mui/material';

import CustomTable from 'src/components/Table';
import Label from 'src/components/Label';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersAsync } from 'src/redux/Order/orderThunk';
import { RUPEE_SYMBOL } from 'src/utils/constants';
import moment from 'moment';
import { useNavigate } from 'react-router';

const getStatusLabel = (status) => {
  const map = {
    Payment_Completed: {
      text: 'Completed',
      color: 'success'
    },
    Payment_Pending: {
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

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { data, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrdersAsync());
  }, []);

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'Payment_Completed',
      name: 'Completed'
    },
    {
      id: 'pending',
      name: 'Pending'
    }
  ];

  const columns = [
    {
      header: 'Customer Name',
      accessor: 'customerName'
    },
    {
      header: 'Products',
      accessor: 'total_amount',
      cell: ({ row }) => {
        return <>{row.items.length}</>;
      }
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      cell: ({ value }) => {
        return <>{moment(value).format('DD/MM/YY')}</>;
      }
    },
    {
      header: 'Advanced payment',
      accessor: 'advance_payment',
      cell: ({ value }) => {
        return (
          <>
            {RUPEE_SYMBOL} {value}
          </>
        );
      }
    },
    {
      header: 'Remaining Amount',
      accessor: 'remainingAmount',
      cell: ({ value }) => {
        return (
          <>
            {RUPEE_SYMBOL} {value}
          </>
        );
      }
    },
    {
      header: 'total',
      accessor: 'total_amount',
      cell: ({ value }) => {
        return (
          <>
            {RUPEE_SYMBOL} {value}
          </>
        );
      }
    },
    {
      id: 'status',
      header: 'Payment',
      accessor: 'status',
      cell: ({ value }) => {
        return getStatusLabel(value);
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => {
        return (
          <Stack spacing={1} direction="row">
            <Button
              variant="outlined"
              onClick={() => navigate(`/order/add-payment/${row._id}`)}
            >
              Add Payment
            </Button>
          </Stack>
        );
      }
    }
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
                <InputLabel>Payment</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label="Payment"
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
      <CustomTable
        columns={columns}
        data={filteredCryptoOrders}
        loading={loading}
      />
    </Card>
  );
};

export default OrdersTable;
