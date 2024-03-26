import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tooltip
} from '@mui/material';
import { useEffect, useState } from 'react';

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
import PrintDialog from 'src/components/Dialogs/PrintDialog';
import Label from 'src/components/Label';
import CustomTable from 'src/components/Table';
import useQuery from 'src/hooks/useQuery';
import { cancelOrderAsync, getOrdersAsync } from 'src/redux/Order/orderThunk';
import { DATE_FORMAT, RUPEE_SYMBOL, TYPES } from 'src/utils/constants';
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

  const [filters, setFilters] = useState({
    dispatch: false,
    filterType: 'all'
  });

  const handlePrint = (data) => {
    setOpenPrintModal({
      open: true,
      data
    });
  };

  const { data, count, loading } = useSelector((state) => state.order);

  const fetchData = async ({ page, limit, search, filters }) => {
    await dispatch(
      getOrdersAsync({
        ...filters,
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
    const page = parseInt(query['page']);
    const limit = parseInt(query['limit']);
    const search = query['search'] || '';
    const dispatch = query['dispatch'] || false;
    const filterType = query['filterType'] || 'all';
    await fetchData({ page, limit, search, dispatch, filterType });
    handleCloseCancelDialog();
  };

  const handleViewDetails = (row) => {
    let url = '';
    if (row.status !== 'price_not_fixed') {
      url = `/order/view-details/${row._id}`;
    } else {
      url = `/transaction/add-payment/${row._id}`;
    }
    navigate(url);
  };

  const columns = [
    {
      header: 'Order Number',
      accessor: 'orderNo',
      cell: ({ value }) => {
        return (
          <Label color="secondary">{`${value ? `#${value}` : '-'}`}</Label>
        );
      }
    },
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
      id: 'dueDate',
      header: 'Due Date',
      accessor: 'dueDate',
      cell: ({ value }) => {
        return moment(value).format(DATE_FORMAT);
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
      accessor: 'date',
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
            <Tooltip title="View details" arrow>
              <IconButton
                color={'primary'}
                onClick={() => handleViewDetails(row)}
              >
                <VisibilityTwoTone />
              </IconButton>
            </Tooltip>
            {row.status !== 'Cancelled' && (
              <Tooltip title="Print Receipt" arrow>
                <IconButton color="info" onClick={() => handlePrint(row)}>
                  <PrintTwoTone />
                </IconButton>
              </Tooltip>
            )}
            {!row?.dispatch && row.status !== 'Cancelled' && (
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

  const handleSetFilter = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const DispatchFilter = () => {
    return (
      <Card>
        <Box
          display="flex"
          p={1}
          px={2}
          justifyItems="center"
          alignItems="center"
        >
          <FormControlLabel
            sx={{
              ml: 0
            }}
            control={
              <Switch
                color="primary"
                sx={{
                  ml: 1
                }}
                checked={filters?.dispatch}
              />
            }
            label="Delivered"
            labelPlacement="start"
            onChange={(e) => {
              handleSetFilter('dispatch', Boolean(e.target.checked));
            }}
          />
        </Box>
      </Card>
    );
  };

  const TypeFilter = () => {
    return (
      <Box
        sx={{
          width: {
            xs: '100%',
            md: 150
          }
        }}
      >
        <FormControl fullWidth variant="outlined">
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.filterType || 'all'}
            onChange={(e) => {
              handleSetFilter('filterType', e.target.value);
            }}
            label="Status"
            autoWidth
          >
            <MenuItem value="all">All</MenuItem>
            {TYPES.map((type, index) => (
              <MenuItem key={index} value={type?.value}>
                {type?.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };

  useEffect(() => {
    if (query) {
      const dispatch = query['dispatch'] || false;
      const filterType = query['filterType'] || 'all';
      setFilters({
        dispatch,
        filterType
      });
    }
  }, [query]);

  return (
    <>
      <Card>
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
        <Divider />
        <CustomTable
          columns={columns}
          data={data}
          loading={loading}
          fetchData={fetchData}
          count={count}
          searchPlaceholder="Search by names"
          actions={[DispatchFilter, TypeFilter]}
          filters={filters}
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
