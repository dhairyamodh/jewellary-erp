import {
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Stack,
  Tooltip
} from '@mui/material';

import {
  AddTwoTone,
  CancelTwoTone,
  CardMembershipTwoTone,
  PaymentTwoTone,
  VisibilityTwoTone
} from '@mui/icons-material';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import AddEMIAmountDialog from 'src/components/Dialogs/AddEMIAmountDialog';
import DeleteDialog from 'src/components/Dialogs/DeleteDialog';
import WithdrawEMIDialog from 'src/components/Dialogs/WithdrawEMIDialog';
import Label from 'src/components/Label';
import CustomTable from 'src/components/Table';
import useQuery from 'src/hooks/useQuery';
import { cancelEmiAsync, getEmiListAsync } from 'src/redux/EMI/emiThunk';
import { DATE_FORMAT, RUPEE_SYMBOL } from 'src/utils/constants';

const EmiTable = () => {
  const getStatusLabel = (status) => {
    const map = {
      pending: {
        text: 'Pending',
        color: 'warning'
      },
      withdraw: {
        text: 'Withdrawed',
        color: 'success'
      },
      Cancelled: {
        text: 'Cancelled',
        color: 'error'
      },
      mature: {
        text: 'Matured',
        color: 'info'
      }
    };
    const { text, color } = map[status] || {};

    return text ? <Label color={color}>{text}</Label> : <>-</>;
  };

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { data, count, loading } = useSelector((state) => state.emi);

  const [state, setState] = useState({
    openEMI: false,
    emiId: undefined,
    openWithdraw: false
  });

  const handleClickAddPayment = (row) => {
    setState({
      openEMI: true,
      emiId: row._id
    });
  };

  const handleCloseEMIModal = () => {
    setState({
      openEMI: false,
      emiId: undefined
    });
  };

  const fetchData = ({ page, limit, search }) => {
    dispatch(
      getEmiListAsync({
        search,
        page,
        perpage: limit
      })
    );
  };

  const query = useQuery();

  const reFetchData = () => {
    const page = query.get('page');
    const limit = query.get('limit');
    const search = query.get('search') || '';
    fetchData({ page, limit, search });
  };

  const handleAddEMIPayment = () => {
    reFetchData();
    handleCloseEMIModal();
  };

  const handleWithdraw = (id) => {
    setState({
      openWithdraw: true,
      emiId: id
    });
  };

  const handleCloseWithdrawEMIModal = () => {
    setState({
      openWithdraw: false,
      emiId: undefined
    });
  };

  const handleAfterWithdraw = () => {
    reFetchData();
    handleCloseWithdrawEMIModal();
  };

  const [openCancel, setOpenCancel] = useState({
    open: false,
    id: undefined
  });

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
    await dispatch(cancelEmiAsync({ id: openCancel?.id }));
    const page = query.get('page');
    const limit = query.get('limit');
    const search = query.get('search') || '';
    await fetchData({ page, limit, search });
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
      header: 'Total creadited amount',
      accessor: 'total_creditamount',
      cell: ({ value }) => {
        return (
          <>
            {RUPEE_SYMBOL} {value?.toLocaleString()}
          </>
        );
      }
    },
    {
      header: 'EMI amount',
      accessor: 'fixed_Emi',
      cell: ({ value }) => {
        return (
          <>
            {RUPEE_SYMBOL} {value?.toLocaleString()}
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
            <Tooltip title="View details" arrow>
              <IconButton
                color={'primary'}
                onClick={() => {
                  navigate(`/emi/view-details/${row?._id}`);
                }}
              >
                <VisibilityTwoTone />
              </IconButton>
            </Tooltip>
            {row.status === 'pending' && (
              <>
                <Tooltip title="Add EMI Payment" arrow>
                  <IconButton
                    color="info"
                    onClick={() => handleClickAddPayment(row)}
                  >
                    <PaymentTwoTone />
                  </IconButton>
                </Tooltip>
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
            {row.status === 'mature' && (
              <Tooltip title="Withdraw EMI" arrow>
                <IconButton
                  color="warning"
                  onClick={() => handleWithdraw(row?._id)}
                >
                  <CardMembershipTwoTone />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      }
    }
  ];

  return (
    <>
      <AddEMIAmountDialog
        open={state.openEMI}
        onClose={handleCloseEMIModal}
        id={state.emiId}
        onClick={handleAddEMIPayment}
      />
      <WithdrawEMIDialog
        open={state.openWithdraw}
        onClose={handleCloseWithdrawEMIModal}
        id={state.emiId}
        onClick={handleAfterWithdraw}
      />
      <Card>
        <CardHeader
          action={
            <Stack direction="row" gap={2} justifyContent="flex-end">
              <Link to="/emi/add">
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
          title="EMI List"
        />
        <Divider />
        <DeleteDialog
          onAccept={handleCancelOrder}
          open={openCancel.open}
          onClose={handleCloseCancelDialog}
        />
        <CustomTable
          columns={columns}
          data={data}
          loading={loading}
          fetchData={fetchData}
          count={count}
          searchPlaceholder="Search by names"
        />
      </Card>
    </>
  );
};

export default EmiTable;
