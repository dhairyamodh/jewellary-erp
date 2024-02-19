import { Card, CardHeader, Divider, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Label from 'src/components/Label';
import CustomTable from 'src/components/Table';
import {
  exportExcelAsync,
  getOrderReportAsync
} from 'src/redux/Report/reportThunk';
import { DATE_FORMAT, RUPEE_SYMBOL } from 'src/utils/constants';
import { VisibilityTwoTone } from '@mui/icons-material';

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
    }
  };

  const { text, color } = map[status];

  return <Label color={color}>{text}</Label>;
};

const ReportTable = () => {
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

  const navigate = useNavigate();

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
        return moment(value).format(DATE_FORMAT);
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => {
        return (
          <Tooltip title="View details" arrow>
            <IconButton
              color={'primary'}
              onClick={() => navigate(`/order/view-details/${row._id}`)}
            >
              <VisibilityTwoTone />
            </IconButton>
          </Tooltip>
        );
      }
    }
  ];

  const handleExportExcel = () => {
    let params = new URL(document.location).searchParams;
    const startDate = moment(params.get('startDate')).format('yy-MM-DD');
    const endDate = moment(params.get('endDate')).format('yy-MM-DD');
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
        Export Excel
      </LoadingButton>
    );
  };

  return (
    <Card>
      <CardHeader title="Order Report" />
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
