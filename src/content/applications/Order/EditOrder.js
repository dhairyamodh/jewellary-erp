import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid
} from '@mui/material';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BackButton from 'src/components/BackButton';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { editOrderAsync, getOrderById } from 'src/redux/Order/orderThunk';
import OrderForm from './OrderForm';

const EditOrder = () => {
  const { id } = useParams();
  const { details, loading } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getOrderById({ id }));
    }
  }, [id]);

  const defaultValue = {
    customerName: details?.customerName,
    customerMobile: details?.customerMobile,
    address: details?.address,
    isFullPayment: details?.isFullPayment,
    paymentType: details?.paymentType,
    taxAmount: details?.taxAmount || 0,
    taxRate: details?.taxRate || 0,
    discount: parseFloat(details?.discount_amount) || 0,
    subTotal: details?.subTotal || 0,
    remark: details?.remark,
    date: details.date,
    item: details?.items?.map((i) => {
      return {
        name: i?.name,
        type: i.type,
        quantity: parseInt(i.qauntity || 1),
        weight: parseFloat(i.weight),
        price: parseFloat(i.price),
        itemRate: parseFloat(i.itemRate),
        design: i?.item_no,
        labour: i?.labour
      };
    }),
    replaceItems:
      details?.replacement?.length > 0
        ? details?.replacement?.map((i) => {
            return {
              name: i?.name,
              type: i.type,
              quantity: 1,
              weight: parseFloat(i.weight),
              price: parseFloat(i.total_Price)
            };
          })
        : [
            {
              name: '',
              type: 'gold',
              weight: '',
              price: ''
            }
          ],
    transactions: details?.transactions,
    total: parseFloat(details?.total_amount),
    advancedPayment: parseFloat(details?.advance_payment)
  };

  const onSubmit = async (data) => {
    const request = {
      id: details?._id,
      data: {
        customerName: data.customerName,
        customerMobile: data.customerMobile,
        address: data.address,
        isFullPayment: data.isFullPayment,
        dispatch: data.dispatch,
        paymentType: data.paymentType,
        taxAmount: data.taxAmount || 0,
        taxRate: data.taxRate || 0,
        discount_amount: parseFloat(data.discount) || 0,
        subTotal: data.subTotal,
        remark: data.remark,
        date: data.date,
        dueDate: data.dueDate,
        items: data.item.map((i) => {
          return {
            name: i?.name,
            type: i.type,
            quantity: parseInt(i.qauntity || 1),
            weight: parseFloat(i.weight).toFixed(3),
            price: parseFloat(i.price),
            itemRate: parseFloat(i.itemRate),
            item_no: i?.design,
            labour: i?.labour,
            rate: parseFloat(i.rate)
          };
        }),
        replacement: data.replaceItems[0]?.name
          ? data.replaceItems.map((i) => {
              return {
                name: i?.name,
                type: i.type,
                quantity: 1,
                weight: parseFloat(i.weight).toFixed(3),
                total_Price: parseFloat(i.price)
              };
            })
          : [],
        total_amount: parseFloat(data.total),
        advance_payment: parseFloat(data.advancedPayment)
      }
    };
    const res = await dispatch(editOrderAsync(request));
    return res;
  };

  if (loading) {
    return <SuspenseLoader />;
  }

  return (
    <>
      <Helmet>
        <title>Edit Order</title>
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
                <CardHeader avatar={<BackButton />} title="Edit Order" />
                <Divider />
                <CardContent>
                  <OrderForm onSubmit={onSubmit} defaultValue={defaultValue} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default EditOrder;
