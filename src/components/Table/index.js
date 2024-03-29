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
import moment from 'moment';
import { useEffect, useState } from 'react';
import useQuery from 'src/hooks/useQuery';
import DateRange from '../DateRange';
import SearchComponent from '../Search';

const CustomTable = ({
  columns,
  data,
  loading,
  count,
  searchPlaceholder,
  fetchData,
  isDateFilter = false,
  actions,
  filters
}) => {
  const query = useQuery();
  const [page, setPage] = useState(parseInt(query['page']) || 1);
  const [limit, setLimit] = useState(parseInt(query['limit']) || 5);
  const [search, setSearch] = useState(query['search'] || '');
  const [startDate, setStartDate] = useState(
    moment(query['startDate'] || moment().subtract(1, 'month'))
  );
  const [endDate, setEndDate] = useState(moment(query['endDate'] || moment()));
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

  const fetchServerData = async (
    page,
    limit,
    search,
    startDate,
    endDate,
    filters
  ) => {
    await fetchData({ page, limit, search, startDate, endDate, filters });
  };

  useEffect(() => {
    const fetchDataAndUpdateURL = async () => {
      const paramsObject = {
        ...filters,
        page,
        limit,
        search: search || '',
        ...(isDateFilter && { startDate, endDate })
      };
      const url = new URL(window.location);
      Object.entries(paramsObject).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
      window.history.pushState(null, '', url.toString());

      await fetchServerData(page, limit, search, startDate, endDate, filters);
    };

    if (isMounted) {
      fetchDataAndUpdateURL();
    } else {
      setIsMounted(true);
    }
  }, [isMounted, page, limit, search, startDate, endDate, filters]);

  useEffect(() => {
    if (query) {
      setSearch(query['search'] || '');
      setPage(parseInt(query['page']) || 1);
      setLimit(parseInt(query['limit']) || 5);
      setStartDate(query['startDate'] || moment().subtract(1, 'month'));
      setEndDate(query['endDate'] || moment());
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

        <SearchComponent
          fetchData={(data) => setSearch(data)}
          value={search}
          placeholder={searchPlaceholder}
        />
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
