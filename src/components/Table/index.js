import {
  Box,
  CircularProgress,
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
import { useQuery } from 'src/hooks/useQuery';

const CustomTable = ({ columns, data, loading, count, fetchData }) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  useEffect(() => {
    console.log('search', search);
    const fetchServerData = async () => {
      await fetchData(page, limit, search);
    };
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);
    url.searchParams.set('search', search || '');
    window.history.pushState(null, '', url.toString());
    fetchServerData();
  }, [page, limit, search]);

  const query = useQuery();

  useEffect(() => {
    if (query) {
      setSearch(query.get('search') || '');
      setPage(parseInt(query.get('page')) || 1);
      setLimit(parseInt(query.get('limit')) || 5);
    }
  }, [query]);

  useEffect(() => {
    if (search && search !== '') {
      setPage(1);
    }
  }, [search]);

  return (
    <div>
      <Box display="flex" justifyContent="end" pt={2} px={1}>
        <SearchComponent
          fetchData={(data) => setSearch(data)}
          label="Search by names"
          value={search}
          sx={{
            minWidth: 250
          }}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            {columns.map((header) => (
              <TableCell>{header.header}</TableCell>
            ))}
          </TableHead>
          <TableBody>
            {!loading ? (
              data?.length > 0 ? (
                data?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      {columns.map((header) => {
                        return (
                          <TableCell>
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
                    <CircularProgress size={25} />
                    <i>Fetching records...</i>
                  </Stack>
                </TableCell>
              </TableRow>
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
            rowsPerPageOptions={[5, 10, 25, 30]}
          />
        </Box>
      )}
    </div>
  );
};

export default CustomTable;
