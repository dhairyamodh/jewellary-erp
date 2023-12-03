import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createOrderAsync } from 'src/redux/Order/orderThunk';

const AddEntry = () => {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      isFullPayment: true,
      item: [
        {
          itemName: '',
          type: 'gold',
          quantity: 1,
          weight: '',
          price: ''
        }
      ]
    }
  });

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.order);

  const onSubmit = (data) => {
    dispatch(
      createOrderAsync({
        ...data,
        items: data.item,
        total_amount: data.total,
        advance_payment: data.advancedPayment,
        address: 'ddfdf'
      })
    );
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'item'
  });

  const item = useWatch({
    control,
    name: 'item'
  });

  useEffect(() => {
    let total = 0;
    item.forEach((field) => {
      const price = parseFloat(field.price) || field?.target?.value || 0;
      total += price;
    });
    setValue('total', total);
  }, [item]);

  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <Container maxWidth="xl">
        <Box py={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={3}
            >
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Create Order" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <TextField
                          name="customerName"
                          label="Customer Name"
                          fullWidth
                          {...register('customerName', {
                            required: true
                          })}
                          error={Boolean(errors?.customerName)}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          name="customerMobile"
                          label="Customer Mobile"
                          fullWidth
                          {...register('customerMobile', {
                            required: true
                          })}
                          error={Boolean(errors?.customerMobile)}
                        />
                      </Grid>
                      {fields.map((field, index) => (
                        <Grid item xs={12} key={field.id}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                              <TextField
                                name={`item.${index}.itemName`}
                                label="Item Name"
                                fullWidth
                                {...register(`item.${index}.itemName`, {
                                  required: true
                                })}
                                error={Boolean(errors?.item?.[index]?.itemName)}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <FormControl fullWidth>
                                <InputLabel>Item type</InputLabel>
                                <Select
                                  label="Item type"
                                  defaultValue="gold"
                                  name={`item.${index}.type`}
                                  {...register(`item.${index}.type`, {
                                    required: true
                                  })}
                                  error={Boolean(errors?.item?.[index]?.type)}
                                >
                                  <MenuItem value="gold">Gold</MenuItem>
                                  <MenuItem value="silver">Silver</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                label="Quantity"
                                fullWidth
                                type="number"
                                name={`item.${index}.quantity`}
                                {...register(`item.${index}.quantity`, {
                                  required: true
                                })}
                                error={Boolean(errors?.item?.[index]?.qauntity)}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                label="Weight/gm"
                                fullWidth
                                type="number"
                                name={`item.${index}.weight`}
                                {...register(`item.${index}.weight`, {
                                  required: true
                                })}
                                error={Boolean(errors?.item?.[index]?.weight)}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                label="Price"
                                type="number"
                                fullWidth
                                name={`item.${index}.price`}
                                {...register(`item.${index}.price`, {
                                  required: true
                                })}
                                error={Boolean(errors?.item?.[index]?.price)}
                              />
                            </Grid>
                            <Grid item xs={12} md={1}>
                              {index === 0 ? (
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  sx={{
                                    height: '100%'
                                  }}
                                  onClick={append}
                                >
                                  Add
                                </Button>
                              ) : (
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  color="error"
                                  sx={{
                                    height: '100%'
                                  }}
                                  onClick={() => remove(index)}
                                >
                                  Remove
                                </Button>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12} md={6}>
                        {/* <Grid container spacing={2}></Grid> */}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={6}>
                                <Typography>Full Payment</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  control={<Switch color="primary" />}
                                  {...register(`isFullPayment`)}
                                  checked={watch('isFullPayment')}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Typography>Payment Type</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControl fullWidth>
                                  <Select
                                    defaultValue="cash"
                                    name="type"
                                    {...register('paymentType', {
                                      required: true
                                    })}
                                  >
                                    <MenuItem value="cash">Cash</MenuItem>
                                    <MenuItem value="upi">UPI</MenuItem>
                                    <MenuItem value="card">Card</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              {!watch('isFullPayment') && (
                                <>
                                  <Grid item xs={6}>
                                    <Typography>Advanced Payment</Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <TextField
                                      label="Price"
                                      type="number"
                                      fullWidth
                                      name="price"
                                      {...register('advancedPayment', {
                                        required: !watch('isFullPayment')
                                      })}
                                      error={Boolean(errors?.advancedPayment)}
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography>Due Date</Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <TextField
                                      label="Due Date"
                                      type="date"
                                      defaultValue={new Date()}
                                      min={new Date()}
                                      fullWidth
                                      name="dueDate"
                                      {...register('dueDate', {
                                        required: !watch('isFullPayment')
                                      })}
                                      error={Boolean(errors?.dueDate)}
                                    />
                                  </Grid>
                                </>
                              )}
                              <Grid item xs={6}>
                                <Typography variant="h4">Total</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  textAlign="right"
                                  variant="h4"
                                  {...register('total')}
                                >
                                  ₹ {watch('total')?.toLocaleString()}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="end">
                          <LoadingButton
                            loading={loading}
                            variant="contained"
                            type="submit"
                          >
                            Submit
                          </LoadingButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default AddEntry;
