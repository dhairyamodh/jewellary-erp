import { Box, Container, Grid, Typography } from '@mui/material';
import moment from 'moment';
import 'src/assets/css/style.css';
import { RUPEE_SYMBOL } from 'src/utils/constants';

const OrderInvoice = ({ data }) => {
  return (
    <div className="invoice-4 invoice-content">
      <Container>
        <Grid container>
          <Grid item lg={12}>
            <div className="invoice-inner" id="invoice_wrapper">
              <div className="invoice-top">
                <Grid container>
                  <Grid item sm={6}>
                    <div className="logo">
                      {/* <img src="/icon-512x512.png" alt="logo" /> */}
                      <Typography variant="h2">Mahalaxmi Jewellers</Typography>
                    </div>
                  </Grid>
                  <Grid item sm={6}>
                    <Box textAlign="end" className="invoice">
                      <Typography variant="h2">Invoice</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </div>
              <div className="invoice-titel">
                <Grid container>
                  <Grid item sm={6}>
                    <div className="invoice-number">
                      <Typography variant="h4">
                        Invoice Number: #45613
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item sm={6} textAlign="end">
                    <div className="invoice-date">
                      <Typography variant="h4">
                        Invoice Date: {moment().format('DD MMM yy')}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="invoice-info">
                <Grid container spacing={2}>
                  <Grid item sm={6} mb={2}>
                    <div className="invoice-number">
                      <Typography variant="h4" className="inv-title-1">
                        Invoice To
                      </Typography>
                      <Typography className="invo-addr-1">
                        {data?.customerName} <br />
                        {data?.customerMobile} <br />
                        {data?.address} <br />
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item sm={6} mb={2}>
                    <Box textAlign="end" className="invoice-number">
                      <Typography variant="h4" className="inv-title-1">
                        Bill To
                      </Typography>
                      <Typography className="invo-addr-1">
                        Mahalaxmi Jewellers <br />
                        billing@apexo.com <br />
                        Jagana, palanpur <br />
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item sm={6} mb={2}>
                    <Typography variant="h4" className="inv-title-1">
                      GST No.
                    </Typography>
                    <Typography className="inv-from-1">
                      873AJFGHDJHJF90
                    </Typography>
                  </Grid>
                  <Grid item sm={6} mb={2} textAlign="end">
                    <Typography variant="h4" className="inv-title-1">
                      Payment Method
                    </Typography>
                    <Typography className="inv-from-1">
                      {data?.paymentType}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
              <div className="order-summary">
                <table className="table invoice-table">
                  <thead className="bg-active">
                    <tr>
                      <th width="100%">Description</th>
                      <th width="10%">Type</th>
                      <th width="10%">Quantity</th>
                      <th width="10%">Weight/gm</th>
                      <th width="15%">Labour Charge</th>
                      <th width="15%">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td className="text-center">{item.type}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-center">{item.weight}</td>
                        <td className="text-center">{`${RUPEE_SYMBOL} ${item.labour}`}</td>
                        <td className="text-center">{`${RUPEE_SYMBOL} ${item.price}`}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'end' }}>
                        SubTotal
                      </td>
                      <td className="text-right">{`${RUPEE_SYMBOL} ${data.total_amount}`}</td>
                    </tr>
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'end' }}>
                        Tax
                      </td>
                      <td className="text-right">{`${RUPEE_SYMBOL} ${data.tax}`}</td>
                    </tr>
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: 'end' }}
                        className="fw-bold"
                      >
                        Grand Total
                      </td>
                      <td className="text-right fw-bold">{`${RUPEE_SYMBOL} ${data.grandTotal}`}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="invoice-informeshon">
                <Grid container spacing={2}>
                  {/* <Grid item md={6} sm={6}>
                    <div className="payment-info mb-30">
                      <Typography variant="h4" className="inv-title-1">
                        Payment Info
                      </Typography>
                      <ul className="bank-transfer-list-1">
                        <li>
                          <strong>Account Name:</strong> 00 123 647 840
                        </li>
                        <li>
                          <strong>Account Number:</strong> Jhon Doe
                        </li>
                        <li>
                          <strong>Branch Name:</strong> xyz
                        </li>
                      </ul>
                    </div>
                  </Grid> */}
                  {/* <Grid item md={6} sm={6}>
                    <div className="terms-and-condistions mb-30">
                      <Typography variant="h4" className="inv-title-1">
                        Terms and Condistions
                      </Typography>
                      <Typography className="mb-0">
                        Once order done, money can't refund. Delivery might
                        delay due to
                      </Typography>
                    </div>
                  </Grid> */}
                  <Grid item md={9} sm={9}>
                    <div className="nates mb-30">
                      <Typography variant="h4" className="inv-title-1">
                        Notes
                      </Typography>
                      <Typography className="text-muted">
                        This is computer generated invoice and physical
                        signature
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item md={3} sm={3}>
                    <div className="nates mb-30">
                      <Box
                        mb={1}
                        sx={{
                          borderBottom: '1px solid black',
                          height: 30,
                          width: '100%'
                        }}
                      />
                      <Typography textAlign="center">
                        Authorized Signature
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>

              <div className="invoice-contact clearfix">
                <div className="contact-info">
                  <a href="tel:+55-4XX-634-7071">
                    <i className="fa fa-phone" /> +00 123 647 840
                  </a>
                  <a href="tel:info@themevessel.com">
                    <i className="fa fa-envelope" /> info@themevessel.com
                  </a>
                  <a
                    href="tel:info@themevessel.com"
                    className="mr-0 d-none-580"
                  >
                    <i className="fa fa-map-marker" /> Jagana, palanpur - 385001
                  </a>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default OrderInvoice;
