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
import { getOrdersAsync } from 'src/redux/Order/orderThunk';
import { RUPEE_SYMBOL } from 'src/utils/constants';
import { useNavigate } from 'react-router';
import DiscountDialog from 'src/components/Dialogs/DiscountDialog';
import { useQuery } from 'src/hooks/useQuery';

const getStatusLabel = (status) => {
  const map = {
    Payment_Completed: {
      text: 'Completed',
      color: 'success'
    },
    cancel_order: {
      text: 'Canceled',
      color: 'error'
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

const TransactionsTable = () => {
  const [selectedCryptoOrders] = useState([]);
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [filters, setFilters] = useState({
    status: null
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { data, count, loading } = useSelector((state) => state.order);

  const [openDiscount, setOpenDiscount] = useState({
    id: undefined,
    open: false
  });

  const query = useQuery();

  const handleOpenDiscount = (id) => {
    setOpenDiscount({
      open: true,
      id: id
    });
  };

  const handleCloseDiscount = () => {
    setOpenDiscount({
      open: false,
      id: undefined
    });
  };

  const handleAddDiscount = () => {
    const page = query.get('page');
    const limit = query.get('limit');
    const search = query.get('search') || '';
    fetchData(page, limit, search);
    handleCloseDiscount();
  };

  const fetchData = (page, limit, search) => {
    dispatch(
      getOrdersAsync({
        search,
        page,
        perpage: limit
      })
    );
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
    },
    {
      id: 'cancel_order',
      name: 'Canceled'
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
      header: 'Previous Payment',
      accessor: 'transactions',
      cell: ({ value }) => {
        return (
          <>
            {RUPEE_SYMBOL} {value?.at(-1)?.amount || 0}
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
              color={row?.status !== 'pending' ? 'secondary' : 'primary'}
              onClick={() => navigate(`/transaction/add-payment/${row._id}`)}
            >
              {row?.status !== 'pending' ? 'View details' : 'Add Payment'}
            </Button>
            {row?.status === 'pending' && (
              <Button
                variant="outlined"
                onClick={() => handleOpenDiscount(row?._id)}
              >
                Discount
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
            </Stack>
          }
          title="Transaction List"
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
      <DiscountDialog
        open={openDiscount?.open}
        onClose={handleCloseDiscount}
        onClick={handleAddDiscount}
        id={openDiscount?.id}
      />
    </Card>
  );
};

export default TransactionsTable;
