import { Box, Grid, Typography } from '@mui/material';
import moment from 'moment';
import 'src/assets/css/style.css';
import { RUPEE_SYMBOL } from 'src/utils/constants';

const OrderReceipt = ({ data }) => {
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
              <div className="invoice-titel">
                <Grid container>
                  <Grid item sm={6}>
                    <div className="invoice-number">
                      <Typography variant="h4">
                        Invoice Number: {data?.orderNo}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item sm={6} textAlign="end">
                    <div className="invoice-date">
                      <Typography variant="h4">
                        Date: {moment().format('DD MMM, yy')}
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
                  <Grid item sm={6} mb={2}>
                    <Box textAlign="end" className="invoice-number">
                      <Typography variant="h5" className="inv-title-1">
                        Bill To
                      </Typography>
                      <Typography className="invo-addr-1">
                        Shree Mahakali Jewellers
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </div>
              <div className="order-summary">
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Items
                </Typography>
                <table className="table invoice-table">
                  <thead className="bg-active">
                    <tr>
                      <th width="40%">Description</th>
                      <th width="10%">Qty.</th>
                      <th width="10%">Weight</th>
                      <th width="15%">Rate</th>
                      <th width="15%">Price</th>
                      <th width="15%">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-center">{item.weight}</td>
                        <td className="text-center">{`${RUPEE_SYMBOL} ${item?.rate?.toLocaleString()}`}</td>
                        <td className="text-center">{`${RUPEE_SYMBOL} ${item?.itemRate?.toLocaleString()}`}</td>
                        <td className="text-center">{`${RUPEE_SYMBOL} ${item.price.toLocaleString()}`}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'end' }}>
                        SubTotal
                      </td>
                      <td className="text-right">
                        {RUPEE_SYMBOL}&nbsp;{data.subTotal.toLocaleString()}
                      </td>
                    </tr>
                    {data?.advance_payment && data?.advance_payment > 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'end' }}>
                          Advanced Payment
                        </td>
                        <td className="text-right">
                          {RUPEE_SYMBOL}&nbsp;
                          {data.advance_payment.toLocaleString()}
                        </td>
                      </tr>
                    ) : (
                      ''
                    )}
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'end' }}>
                        Tax
                      </td>
                      <td className="text-right">
                        {RUPEE_SYMBOL}&nbsp;{data.taxAmount.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'end' }}>
                        Discount
                      </td>
                      <td className="text-right">
                        {RUPEE_SYMBOL}&nbsp;
                        {data.discount_amount.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: 'end' }}
                        className="fw-bold"
                      >
                        Grand Total
                      </td>
                      <td className="text-right fw-bold">
                        {RUPEE_SYMBOL}&nbsp;{data.total_amount.toLocaleString()}
                      </td>
                    </tr>
                    {data?.remainingAmount > 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          style={{ textAlign: 'end' }}
                          className="fw-bold"
                        >
                          Remaining Amount
                        </td>
                        <td className="text-right fw-bold">
                          {RUPEE_SYMBOL}&nbsp;
                          {data.remainingAmount.toLocaleString()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {data?.replacement?.length > 0 && (
                <div className="order-summary">
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Replacement Items
                  </Typography>
                  <table className="table invoice-table">
                    <thead className="bg-active">
                      <tr>
                        <th width="40%">Description</th>
                        <th width="10%">Qty.</th>
                        <th width="10%">Weight</th>
                        <th width="15%">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.replacement?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-center">{item.weight}</td>
                          <td className="text-center">{`${RUPEE_SYMBOL} ${item?.total_Price.toLocaleString()}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {data?.transactions?.length > 0 && (
                <div className="order-summary">
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    All Payments
                  </Typography>
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
              )}
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
                  <a className="mr-0 d-none-580">
                    Ugamani Sheri, Near Guru Maharaj Mandir, Jagana, Palanpur,
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

export default OrderReceipt;
