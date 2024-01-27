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
import { getLoanListAsync } from 'src/redux/Loan/loanThunk';
import { DATE_FORMAT, RUPEE_SYMBOL } from 'src/utils/constants';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { AddTwoTone } from '@mui/icons-material';
import moment from 'moment';

const getStatusLabel = (status) => {
  const map = {
    'Loan closed': {
      text: 'Closed',
      color: 'success'
    },
    pending: {
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

const LoansTable = () => {
  const [filters, setFilters] = useState({
    status: null
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { data, count, loading } = useSelector((state) => state.loan);

  const handleClickAddPayment = (row) => {
    navigate(`/loan/add-payment/${row._id}`);
  };

  const fetchData = (page, limit, search) => {
    dispatch(
      getLoanListAsync({
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
      id: 'pending',
      name: 'Pending'
    },
    {
      id: 'Loan closed',
      name: 'Closed'
    }
  ];

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

  const filteredData = applyFilters(data, filters);

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
            sx={{
              width: {
                xs: 250,
                md: 300
              }
            }}
          >
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
        data={filteredData}
        loading={loading}
        fetchData={fetchData}
        count={count}
        searchPlaceholder="Search by names"
      />
    </Card>
  );
};

export default LoansTable;
