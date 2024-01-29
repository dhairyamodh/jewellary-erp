import {
  Box,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchComponent from '../Search';
import DateRange from '../DateRange';
import moment from 'moment';
import useQuery from 'src/hooks/useQuery';

const CustomTable = ({
  columns,
  data,
  loading,
  count,
  searchPlaceholder,
  fetchData,
  isDateFilter = false,
  actions
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(moment().subtract(1, 'month'));
  const [endDate, setEndDate] = useState(moment());
  const [isMounted, setIsMounted] = useState(false);
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleLimitChange = (event) => {
    setPage(1);
    setLimit(parseInt(event.target.value));
  };

  useEffect(() => {
    if (isMounted) {
      const fetchServerData = async () => {
        await fetchData(page, limit, search, startDate, endDate);
      };
      const url = new URL(window.location);
      url.searchParams.set('page', page);
      url.searchParams.set('limit', limit);
      url.searchParams.set('search', search || '');
      if (isDateFilter) {
        url.searchParams.set('startDate', startDate);
        url.searchParams.set('endDate', endDate);
      }
      window.history.pushState(null, '', url.toString());
      fetchServerData();
    } else {
      setIsMounted(true);
    }
  }, [isMounted, page, limit, search, startDate, endDate]);

  const query = useQuery();

  useEffect(() => {
    if (query) {
      setSearch(query.get('search') || '');
      setPage(parseInt(query.get('page')) || 1);
      setLimit(parseInt(query.get('limit')) || 5);
      setStartDate(
        parseInt(query.get('startDate')) || moment().subtract(1, 'month')
      );
      setEndDate(parseInt(query.get('endDate')) || moment());
    }
  }, [query]);

  useEffect(() => {
    if (search && search !== '') {
      setPage(1);
    }
  }, [search]);

  return (
    <div>
      <Stack
        direction="row"
        gap={2}
        justifyContent="end"
        p={2}
        sx={{
          flexDirection: {
            xs: 'column',
            md: 'row'
          },
          minWidth: {
            xs: '100%',
            md: 250
          }
        }}
      >
        <SearchComponent
          fetchData={(data) => setSearch(data)}
          value={search}
          placeholder={searchPlaceholder}
        />
        {isDateFilter && (
          <DateRange
            startDate={startDate}
            endDate={endDate}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
          />
        )}
        {actions &&
          actions?.map((Action, index) => {
            return <Action key={index} />;
          })}
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((header, hIdx) => (
                <TableCell
                  key={hIdx}
                  sx={{
                    whiteSpace: 'nowrap'
                  }}
                >
                  {header.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              data?.length > 0 ? (
                data?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      {columns.map((header, hIndex) => {
                        return (
                          <TableCell
                            key={hIndex}
                            sx={{
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {Object.prototype.hasOwnProperty.call(
                              header,
                              'cell'
                            )
                              ? header?.cell({
                                  row: item,
                                  value: item?.[header?.accessor]
                                })
                              : item[header.accessor]}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns?.length}
                    sx={{
                      textAlign: 'center'
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <i>No records found!!</i>
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            ) : (
              [...Array(limit)]?.map((_, rIdx) => (
                <TableRow key={rIdx}>
                  {[...Array(columns?.length)]?.map((_, cIdx) => {
                    return (
                      <TableCell
                        key={cIdx}
                        sx={{
                          textAlign: 'center'
                        }}
                      >
                        <Skeleton variant="text" sx={{ fontSize: '1.77rem' }} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {data?.length > 0 && (
        <Box p={2}>
          <TablePagination
            component="div"
            count={count}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page - 1}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 20, 30]}
          />
        </Box>
      )}
    </div>
  );
};

export default CustomTable;
