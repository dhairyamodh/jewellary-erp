import { Box, Grid, Typography } from '@mui/material';
import moment from 'moment';
import 'src/assets/css/style.css';
import { RUPEE_SYMBOL } from 'src/utils/constants';

const TransactionInvoice = ({ data }) => {
  return (
    <div className="invoice-4 invoice-content">
      <div className="container">
        <Grid container>
          <Grid item lg={12}>
            <div className="invoice-inner" id="invoice_wrapper">
              <div className="invoice-top">
                <Grid container>
                  <Grid item sm={12}>
                    <div className="logo">
                      {/* <img src="/icon-512x512.png" alt="logo" /> */}
                      <Typography variant="h1" textAlign="center">
                        Shree Mahakali Jewellers
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="invoice-info">
                <Grid container spacing={2}>
                  <Grid item sm={6} mb={2}>
                    <div className="invoice-number">
                      <Typography variant="h5" className="inv-title-1">
                        Invoice To
                      </Typography>
                      <Typography className="invo-addr-1">
                        {data?.customerName} <br />
                        {data?.customerMobile} <br />
                        {data?.address} <br />
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item sm={6} md={6}>
                    <Box textAlign="end" className="invoice-number">
                      <Typography variant="h5" className="inv-title-1">
                        Date
                      </Typography>
                      <Typography className="invo-addr-1">
                        {moment().format('DD MMM, yy')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </div>
              <div className="order-summary">
                <table className="table invoice-table">
                  <thead className="bg-active">
                    <tr>
                      <th>Amount</th>
                      <th>Payment Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.transactions?.map((item, index) => (
                      <tr key={index}>
                        <td>{`${RUPEE_SYMBOL} ${
                          item?.amount?.toLocaleString() || 0
                        }`}</td>
                        <td className="text-center">{item.paymentType}</td>
                        <td className="text-center">
                          {moment(item.date).format('DD/MM/YY hh:mm a')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="invoice-contact clearfix">
                <div className="contact-info">
                  <a href="tel:9424138655">Mo. 94241 38655</a>
                  <a className="mr-0 d-none-580">
                    Ugamani Street, Near Guru Maharaj Mandir, Jagana, Palanpur,
                    Banaskantha
                  </a>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default TransactionInvoice;
