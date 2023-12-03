import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import React, { useState } from 'react';

const applyPagination = (data, page, limit) => {
  return data.slice(page * limit, page * limit + limit);
};

const CustomTable = ({ columns, data }) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedCryptoOrders = applyPagination(data, page, limit);
  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            {columns.map((header) => (
              <TableCell>{header.header}</TableCell>
            ))}
          </TableHead>
          <TableBody>
            {paginatedCryptoOrders.map((item, index) => {
              return (
                <TableRow key={index}>
                  {columns.map((header) => {
                    return (
                      <TableCell>
                        {Object.prototype.hasOwnProperty.call(header, 'cell')
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
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={paginatedCryptoOrders.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </div>
  );
};

export default CustomTable;
