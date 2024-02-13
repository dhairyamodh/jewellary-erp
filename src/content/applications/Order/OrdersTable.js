import { useState } from 'react';
import { Divider, Card, CardHeader, Stack, Button } from '@mui/material';

import CustomTable from 'src/components/Table';
import Label from 'src/components/Label';
import { useDispatch, useSelector } from 'react-redux';
import { cancelOrderAsync, getOrdersAsync } from 'src/redux/Order/orderThunk';
import { DATE_FORMAT, RUPEE_SYMBOL } from 'src/utils/constants';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { AddTwoTone } from '@mui/icons-material';
import DeleteDialog from 'src/components/Dialogs/DeleteDialog';
import moment from 'moment';
import useQuery from 'src/hooks/useQuery';
import PrintDialog from 'src/components/Dialogs/PrintDialog';
import OrderInvoice from './OrderInvoice';

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
    },
    'complete with discount': {
      text: 'Completed with discount',
      color: 'info'
    }
  };

  const { text, color } = map[status];

  return <Label color={color}>{text}</Label>;
};

const OrdersTable = () => {
  const [selectedCryptoOrders] = useState([]);
  const selectedBulkActions = selectedCryptoOrders.length > 0;

  const [openCancel, setOpenCancel] = useState({
    open: false,
    id: undefined
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [openPrintModal, setOpenPrintModal] = useState({
    open: false,
    data: {}
  });

  const handlePrint = (data) => {
    setOpenPrintModal({
      open: true,
      data
    });
  };

  const { data, count, loading } = useSelector((state) => state.order);

  const fetchData = (page, limit, search) => {
    dispatch(
      getOrdersAsync({
        search,
        page,
        perpage: limit
      })
    );
  };

  const query = useQuery();

  const handleOpenCancelDialog = (id) => {
    setOpenCancel({
      id: id,
      open: true
    });
  };

  const handleCloseCancelDialog = () => {
    setOpenCancel({
      id: undefined,
      open: false
    });
  };

  const handleCancelOrder = () => {
    dispatch(cancelOrderAsync({ id: openCancel?.id }));
    const page = query.get('page');
    const limit = query.get('limit');
    const search = query.get('search') || '';
    fetchData(page, limit, search);
    handleCloseCancelDialog();
  };

  const columns = [
    {
      header: 'Customer Name',
      accessor: 'customerName'
    },
    {
      header: 'Mobile',
      accessor: 'customerMobile',
      cell: ({ value }) => {
        return value;
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
      header: 'Status',
      accessor: 'status',
      cell: ({ value }) => {
        return getStatusLabel(value);
      }
    },
    {
      id: 'createdAt',
      header: 'Created Date',
      accessor: 'createdAt',
      cell: ({ value }) => {
        return moment(value).format(DATE_FORMAT);
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
              color={'primary'}
              onClick={() => navigate(`/order/view-details/${row._id}`)}
            >
              View details
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => handlePrint(row)}
            >
              Print Invoice
            </Button>
            {row.status === 'Payment_Pending' && (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleOpenCancelDialog(row._id)}
              >
                Cancel Order
              </Button>
            )}
          </Stack>
        );
      }
    }
  ];

  return (
    <>
      <Card>
        {!selectedBulkActions && (
          <CardHeader
            action={
              <Stack direction="row" gap={2}>
                <Link to="/order/add">
                  <Button
                    variant="contained"
                    sx={{
                      whiteSpace: 'nowrap',
                      height: '100%'
                    }}
                    startIcon={<AddTwoTone fontSize="small" />}
                  >
                    Create
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
          data={data}
          loading={loading}
          fetchData={fetchData}
          count={count}
          searchPlaceholder="Search by names"
        />
      </Card>
      <DeleteDialog
        onAccept={handleCancelOrder}
        open={openCancel.open}
        onClose={handleCloseCancelDialog}
      />
      <PrintDialog
        open={openPrintModal?.open}
        onClose={() =>
          setOpenPrintModal({
            ...openPrintModal,
            open: false
          })
        }
      >
        <OrderInvoice data={openPrintModal?.data} />
      </PrintDialog>
    </>
  );
};

export default OrdersTable;
