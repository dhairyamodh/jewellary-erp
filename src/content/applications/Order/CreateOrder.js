import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { createOrderAsync } from 'src/redux/Order/orderThunk';
import OrderForm from './OrderForm';
import BackButton from 'src/components/BackButton';

const CreateOrder = () => {
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    (async () => {
      const request = {
        customerName: data.customerName,
        customerMobile: data.customerMobile,
        address: data.address,
        isFullPayment: data.isFullPayment,
        paymentType: data.paymentType,
        taxAmount: data.taxAmount || 0,
        taxRate: data.taxRate || 0,
        discount_amount: parseFloat(data.discount) || 0,
        subTotal: data.subTotal,
        remark: data.remark,
        date: data.date,
        items: data.item.map((i) => {
          return {
            name: i?.name,
            type: i.type,
            quantity: parseInt(i.qauntity || 1),
            weight: parseFloat(i.weight),
            price: parseFloat(i.price),
            itemRate: parseFloat(i.itemRate),
            item_no: i?.design,
            labour: i?.labour
          };
        }),
        replacement: data.replaceItems[0]?.name
          ? data.replaceItems.map((i) => {
              return {
                name: i?.name,
                type: i.type,
                quantity: 1,
                weight: parseFloat(i.weight),
                total_Price: parseFloat(i.price)
              };
            })
          : [],
        transactions:
          data.advancedPayment && parseFloat(data.advancedPayment) > 0
            ? [
                {
                  amount: parseFloat(data.advancedPayment) || 0,
                  paymentType: data.paymentType,
                  remark: data.remark
                }
              ]
            : [],
        total_amount: parseFloat(data.total),
        advance_payment: parseFloat(data.advancedPayment)
      };
      const res = await dispatch(createOrderAsync(request));
      return res;
    })();
  };

  return (
    <>
      <Helmet>
        <title>Create Order</title>
      </Helmet>
      <Container maxWidth="xl">
        <Box py={4}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12}>
              <Card>
                <CardHeader avatar={<BackButton />} title="Create Order" />
                <Divider />
                <CardContent>
                  <OrderForm onSubmit={onSubmit} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default CreateOrder;
