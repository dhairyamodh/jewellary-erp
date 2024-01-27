import { Divider, Card, CardHeader, Stack, Button } from '@mui/material';

import CustomTable from 'src/components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { DATE_FORMAT, RUPEE_SYMBOL } from 'src/utils/constants';
import { Link } from 'react-router-dom';
import { AddTwoTone } from '@mui/icons-material';
import { getEmiListAsync } from 'src/redux/EMI/emiThunk';
import Label from 'src/components/Label';
import moment from 'moment';
import { useState } from 'react';
import AddEMIAmountDialog from 'src/components/Dialogs/AddEMIAmountDialog';
import { useQuery } from 'src/hooks/useQuery';
import WithdrawEMIDialog from 'src/components/Dialogs/WithdrawEMIDialog';

const EmiTable = () => {
  const getStatusLabel = (status) => {
    const map = {
      withdraw: {
        text: 'Withdrawed',
        color: 'success'
      }
    };
    const { text, color } = map[status] || {};

    return text ? <Label color={color}>{text}</Label> : <>-</>;
  };

  const dispatch = useDispatch();

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

  const fetchData = (page, limit, search) => {
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
    fetchData(page, limit, search);
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
          row.status !== 'withdraw' && (
            <Stack spacing={1} direction="row">
              <Button
                variant="contained"
                color={'primary'}
                onClick={() => handleClickAddPayment(row)}
              >
                Add EMI Payment
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleWithdraw(row?._id)}
              >
                Withdraw EMI
              </Button>
            </Stack>
          )
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
          sx={{
            alignItems: {
              xs: 'flex-start',
              md: 'center'
            },
            gap: {
              xs: 3,
              md: 0
            },
            flexDirection: {
              xs: 'column',
              md: 'row'
            }
          }}
          action={
            <Stack
              direction="row"
              gap={2}
              justifyContent="flex-end"
              sx={{
                width: {
                  xs: 250,
                  md: 300
                }
              }}
            >
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
