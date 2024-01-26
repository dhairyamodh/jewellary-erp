import { Divider, Card, CardHeader, Stack, Button } from '@mui/material';

import CustomTable from 'src/components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { RUPEE_SYMBOL } from 'src/utils/constants';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { AddTwoTone } from '@mui/icons-material';
import { getEmiListAsync } from 'src/redux/EMI/emiThunk';

const EmiTable = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { data, count, loading } = useSelector((state) => state.emi);

  const handleClickAddPayment = (row) => {
    navigate(`/loan/add-payment/${row._id}`);
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
      header: 'Total item price',
      accessor: 'totalItemCost',
      cell: ({ value }) => {
        return (
          <>
            {RUPEE_SYMBOL} {value?.toLocaleString()}
          </>
        );
      }
    },
    {
      header: 'Loan cost',
      accessor: 'loanCost',
      cell: ({ value }) => {
        return (
          <>
            {RUPEE_SYMBOL} {value?.toLocaleString()}
          </>
        );
      }
    },
    {
      header: 'Interest Rate',
      accessor: 'interestRate',
      cell: ({ value }) => {
        return <>{value}%</>;
      }
    },
    {
      header: 'Remaining loan amount',
      accessor: 'updatedLoanCost',
      cell: ({ value }) => {
        return (
          <>
            {RUPEE_SYMBOL} {value?.toLocaleString()}
          </>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => {
        return (
          <Stack spacing={1} direction="row">
            {row.status !== 'Loan closed' && (
              <Button
                variant="contained"
                color={'primary'}
                onClick={() => handleClickAddPayment(row)}
              >
                Add payment
              </Button>
            )}
          </Stack>
        );
      }
    }
  ];

  return (
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
            <Link to="/loan/add">
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
        title="Loan List"
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
  );
};

export default EmiTable;
