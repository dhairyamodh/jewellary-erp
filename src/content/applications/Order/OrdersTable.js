import {
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Stack,
  Tooltip
} from '@mui/material';
import { useState } from 'react';

import {
  AddTwoTone,
  CancelTwoTone,
  EditTwoTone,
  PrintTwoTone,
  VisibilityTwoTone
} from '@mui/icons-material';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import DeleteDialog from 'src/components/Dialogs/DeleteDialog';
// import PrintDialog from 'src/components/Dialogs/PrintDialog';
import Label from 'src/components/Label';
import CustomTable from 'src/components/Table';
import useQuery from 'src/hooks/useQuery';
import { cancelOrderAsync, getOrdersAsync } from 'src/redux/Order/orderThunk';
import { DATE_FORMAT, RUPEE_SYMBOL } from 'src/utils/constants';
import PrintDialog from 'src/components/Dialogs/PrintDialog';
import OrderReceipt from './OrderReceipt';
// import OrderInvoice from './OrderInvoice';

const getStatusLabel = (status) => {
  const map = {
    Completed: {
      text: 'Completed',
      color: 'success'
    },
    Cancelled: {
      text: 'Canceled',
      color: 'error'
    },
    Pending: {
      text: 'Pending',
      color: 'warning'
    },
    'complete with discount': {
      text: 'Completed with discount',
      color: 'info'
    },
    price_not_fixed: {
      text: 'Price not fixed',
      color: 'primary'
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

  const fetchData = async (page, limit, search) => {
    await dispatch(
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

  const handleCancelOrder = async () => {
    await dispatch(cancelOrderAsync({ id: openCancel?.id }));
    const page = query.get('page');
    const limit = query.get('limit');
    const search = query.get('search') || '';
    await fetchData(page, limit, search);
    handleCloseCancelDialog();
  };

  const columns = [
    {
      header: 'Customer Name',
      accessor: 'customerName',
      cell: ({ row }) => {
        return (
          <>
            {row.customerName} {`${row.remark ? `(${row.remark})` : ''}`}
          </>
        );
      }
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
            {RUPEE_SYMBOL} {value.toLocaleString()}
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
        console.log(
          row.status !== 'Cancelled' && row.status !== 'price_not_fixed'
        );
        return (
          <Stack spacing={1} direction="row">
            <Tooltip title="View details" arrow>
              <IconButton
                color={'primary'}
                onClick={() => navigate(`/order/view-details/${row._id}`)}
              >
                <VisibilityTwoTone />
              </IconButton>
            </Tooltip>
            {row.status !== 'Cancelled' && row.status !== 'price_not_fixed' && (
              <Tooltip title="Print Invoice" arrow>
                <IconButton color="info" onClick={() => handlePrint(row)}>
                  <PrintTwoTone />
                </IconButton>
              </Tooltip>
            )}
            {row.status === 'price_not_fixed' && (
              <Tooltip title="Edit Order" arrow>
                <IconButton
                  color="success"
                  onClick={() => {
                    navigate(`/order/edit/${row._id}`);
                  }}
                >
                  <EditTwoTone />
                </IconButton>
              </Tooltip>
            )}
            {row.status === 'Pending' && (
              <>
                <Tooltip title="Cancel Order" arrow>
                  <IconButton
                    color="error"
                    onClick={() => handleOpenCancelDialog(row._id)}
                  >
                    <CancelTwoTone />
                  </IconButton>
                </Tooltip>
              </>
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
        <OrderReceipt data={openPrintModal?.data} />
      </PrintDialog>
    </>
  );
};

export default OrdersTable;
