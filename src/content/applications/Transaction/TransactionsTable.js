import { useState } from 'react';
import { Divider, Card, CardHeader, Stack, Button } from '@mui/material';

import CustomTable from 'src/components/Table';
import Label from 'src/components/Label';
import { useDispatch, useSelector } from 'react-redux';
import { getPendingOrdersAsync } from 'src/redux/Order/orderThunk';
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

const TransactionsTable = () => {
  const [selectedCryptoOrders] = useState([]);
  const selectedBulkActions = selectedCryptoOrders.length > 0;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    pendingOrders: data,
    pendingOrderCount: count,
    loading
  } = useSelector((state) => state.order);

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
      getPendingOrdersAsync({
        search,
        page,
        perpage: limit
      })
    );
  };

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
              color={
                row?.status !== 'Payment_Pending' ? 'secondary' : 'primary'
              }
              onClick={() => navigate(`/transaction/add-payment/${row._id}`)}
            >
              {row?.status !== 'Payment_Pending'
                ? 'View details'
                : 'Add Payment'}
            </Button>
            {row?.status === 'Payment_Pending' && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleOpenDiscount(row?._id)}
              >
                Add Discount
              </Button>
            )}
          </Stack>
        );
      }
    }
  ];

  return (
    <Card>
      {!selectedBulkActions && <CardHeader title="Transaction List" />}
      <Divider />
      <CustomTable
        columns={columns}
        data={data}
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
