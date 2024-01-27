import { useState } from 'react';
import { Divider, Card, CardHeader } from '@mui/material';

import CustomTable from 'src/components/Table';
import Label from 'src/components/Label';
import { useDispatch, useSelector } from 'react-redux';
import { DATETIME_FORMAT, RUPEE_SYMBOL } from 'src/utils/constants';
import moment from 'moment';
import {
  exportExcelAsync,
  getOrderReportAsync
} from 'src/redux/Report/reportThunk';
import { useQuery } from 'src/hooks/useQuery';
import { LoadingButton } from '@mui/lab';

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

const ReportTable = () => {
  const [selectedCryptoOrders] = useState([]);
  const selectedBulkActions = selectedCryptoOrders.length > 0;

  const dispatch = useDispatch();

  const { data, count, loading } = useSelector((state) => state.report);

  const [excelLoading, setExcelLoading] = useState(false);

  const fetchData = (page, limit, search, startDate, endDate) => {
    dispatch(
      getOrderReportAsync({
        search,
        page,
        perpage: limit,
        startDate,
        endDate
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
      header: 'Items',
      accessor: 'items',
      cell: ({ value }) => {
        return value?.length;
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
        return moment(value).format(DATETIME_FORMAT);
      }
    }
  ];

  const query = useQuery();

  const handleExportExcel = () => {
    const startDate = moment(query.get('startDate')).format('yy-MM-DD');
    const endDate = moment(query.get('endDate')).format('yy-MM-DD');
    (async () => {
      setExcelLoading(true);
      await dispatch(
        exportExcelAsync({
          startDate,
          endDate
        })
      );
      setExcelLoading(false);
    })();
  };

  const ExportExcelButton = () => {
    return (
      <LoadingButton
        loading={excelLoading}
        variant="outlined"
        onClick={handleExportExcel}
      >
        Export
      </LoadingButton>
    );
  };

  return (
    <Card>
      {!selectedBulkActions && (
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
          title="Order Report"
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
        isDateFilter
        actions={[ExportExcelButton]}
      />
    </Card>
  );
};

export default ReportTable;
