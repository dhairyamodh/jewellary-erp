import { useState } from 'react';
import {
  Divider,
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
import { cancelOrderAsync, getOrdersAsync } from 'src/redux/Order/orderThunk';
import { RUPEE_SYMBOL } from 'src/utils/constants';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { AddTwoTone } from '@mui/icons-material';
import { useQuery } from 'src/hooks/useQuery';

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
  return cryptoOrders?.filter((cryptoOrder) => {
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

  const { data, count, loading } = useSelector((state) => state.order);

  const fetchData = (page, limit, search) => {
    dispatch(
      getOrdersAsync({
        page,
        limit,
        search
      })
    );
  };

  const query = useQuery();

  const handleCancelOrder = (id) => {
    dispatch(cancelOrderAsync({ id }));
    const page = query.get('page');
    const limit = query.get('limit');
    const search = query.get('search') || '';
    fetchData(page, limit, search);
  };

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
      id: 'Payment_Pending',
      name: 'Pending'
    }
  ];

  const columns = [
    {
      header: 'Customer Name',
      accessor: 'customerName'
    },
    {
      header: 'Remaining Amount',
      accessor: 'remainingAmount',
      cell: ({ value, row }) => {
        return (
          <>
            {row.status !== 'Payment_Completed'
              ? `${RUPEE_SYMBOL} ${value}`
              : '-'}
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
              variant="contained"
              color={row?.remainingAmount <= 0 ? 'secondary' : 'primary'}
              onClick={() => navigate(`/order/add-payment/${row._id}`)}
            >
              {row?.remainingAmount <= 0 ? 'View details' : 'Add Payment'}
            </Button>
            {row.status === 'Payment_Pending' && (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleCancelOrder(row._id)}
              >
                Cancel Order
              </Button>
            )}
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
            <Stack direction="row" gap={2} width={300}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Payment</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label="Payment"
                  fullWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Link to="/order/add">
                <Button
                  variant="contained"
                  sx={{
                    whiteSpace: 'nowrap',
                    height: '100%'
                  }}
                  startIcon={<AddTwoTone fontSize="small" />}
                >
                  Create Order
                </Button>
              </Link>
            </Stack>
          }
          title="Order List"
        />
      )}
      <Divider />
      <CustomTable
        columns={columns}
        data={filteredCryptoOrders}
        loading={loading}
        fetchData={fetchData}
        count={count}
      />
    </Card>
  );
};

export default OrdersTable;
