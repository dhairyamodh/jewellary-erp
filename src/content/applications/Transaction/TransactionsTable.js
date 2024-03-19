import {
  Card,
  CardHeader,
  Divider,
  IconButton,
  Stack,
  Tooltip
} from '@mui/material';
import { useState } from 'react';

import {
  DiscountTwoTone,
  PaymentTwoTone,
  PrintTwoTone,
  VisibilityTwoTone
} from '@mui/icons-material';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import OrderDiscountDialog from 'src/components/Dialogs/OrderDiscountDialog';
import PrintDialog from 'src/components/Dialogs/PrintDialog';
import CustomTable from 'src/components/Table';
import useQuery from 'src/hooks/useQuery';
import { getPendingOrdersAsync } from 'src/redux/Order/orderThunk';
import { DATE_FORMAT, RUPEE_SYMBOL } from 'src/utils/constants';
import TransactionInvoice from './TransactionInvoice';

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
    fetchData({ page, limit, search });
    handleCloseDiscount();
  };

  const fetchData = ({ page, limit, search }) => {
    dispatch(
      getPendingOrdersAsync({
        search,
        page,
        perpage: limit
      })
    );
  };

  const [openPrintModal, setOpenPrintModal] = useState({
    open: false,
    data: undefined
  });

  const handlePrint = (data) => {
    setOpenPrintModal({
      open: true,
      data
    });
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
          <>{row.status !== 'Completed' ? `${RUPEE_SYMBOL} ${value}` : '-'}</>
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
            <Tooltip
              title={row?.status !== 'Pending' ? 'View Details' : 'Add Payment'}
              arrow
            >
              <IconButton
                color={row?.status !== 'Pending' ? 'secondary' : 'primary'}
                onClick={() => navigate(`/transaction/add-payment/${row._id}`)}
              >
                {row?.status !== 'Pending' ? (
                  <VisibilityTwoTone />
                ) : (
                  <PaymentTwoTone />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Print Receipt" arrow>
              <IconButton color="info" onClick={() => handlePrint(row)}>
                <PrintTwoTone />
              </IconButton>
            </Tooltip>
            {row?.status === 'Pending' && (
              <Tooltip title="Add Discount" arrow>
                <IconButton
                  color="warning"
                  onClick={() => handleOpenDiscount(row?._id)}
                >
                  <DiscountTwoTone />
                </IconButton>
              </Tooltip>
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
        searchPlaceholder="Search by names"
      />
      <OrderDiscountDialog
        open={openDiscount?.open}
        onClose={handleCloseDiscount}
        onClick={handleAddDiscount}
        id={openDiscount?.id}
      />
      <PrintDialog
        title="Print Receipt"
        open={openPrintModal?.open}
        onClose={() =>
          setOpenPrintModal({
            ...openPrintModal,
            open: false
          })
        }
      >
        <TransactionInvoice data={openPrintModal?.data} />
      </PrintDialog>
    </Card>
  );
};

export default TransactionsTable;
