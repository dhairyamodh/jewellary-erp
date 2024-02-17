import {
  Divider,
  Card,
  CardHeader,
  Stack,
  Button,
  Tooltip,
  IconButton
} from '@mui/material';

import CustomTable from 'src/components/Table';
import Label from 'src/components/Label';
import { useDispatch, useSelector } from 'react-redux';
import { getLoanListAsync } from 'src/redux/Loan/loanThunk';
import { DATE_FORMAT, RUPEE_SYMBOL } from 'src/utils/constants';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import {
  AddTwoTone,
  DiscountTwoTone,
  PaymentTwoTone
} from '@mui/icons-material';
import moment from 'moment';
import { useState } from 'react';
import LoanDiscountDialog from 'src/components/Dialogs/LoanDiscountDialog';
import useQuery from 'src/hooks/useQuery';

const getStatusLabel = (status) => {
  const map = {
    'Loan closed': {
      text: 'Closed',
      color: 'success'
    },
    pending: {
      text: 'Pending',
      color: 'warning'
    },
    'complete with discount': {
      text: 'Closed with discount',
      color: 'info'
    }
  };

  const { text, color } = map[status];

  return <Label color={color}>{text}</Label>;
};

const LoansTable = () => {
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

  const query = useQuery();

  const [openDiscount, setOpenDiscount] = useState({
    id: undefined,
    open: false
  });

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
      header: 'Remaining amount',
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
          row?.status === 'pending' && (
            <Stack spacing={1} direction="row">
              <Tooltip title="Add payment" arrow>
                <IconButton
                  color={'primary'}
                  onClick={() => handleClickAddPayment(row)}
                >
                  <PaymentTwoTone />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add Discount" arrow>
                <IconButton
                  color="warning"
                  onClick={() => handleOpenDiscount(row?._id)}
                >
                  <DiscountTwoTone />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        );
      }
    }
  ];

  return (
    <Card>
      <CardHeader
        action={
          <Stack direction="row" gap={2}>
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
      <LoanDiscountDialog
        open={openDiscount?.open}
        onClose={handleCloseDiscount}
        onClick={handleAddDiscount}
        id={openDiscount?.id}
      />
    </Card>
  );
};

export default LoansTable;
