import { Add, DeleteOutlineTwoTone } from '@mui/icons-material';
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
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import BackButton from 'src/components/BackButton';
import { createOrderAsync } from 'src/redux/Order/orderThunk';
import { RUPEE_SYMBOL } from 'src/utils/constants';

const AddEntry = () => {
  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      isFullPayment: true,
      taxRate: 3,
      discount: 0,
      item: [
        {
          name: '',
          type: 'gold',
          quantity: 1,
          weight: '',
          price: '',
          design: '',
          labour: ''
        }
      ],
      replaceItems: [
        {
          name: '',
          type: 'gold',
          weight: '',
          price: ''
        }
      ]
    }
  });

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.order);
  const [replaceItemsTotal, setReplaceItemsTotal] = useState(0);

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
        transactions: [
          {
            amount: parseFloat(data.advancedPayment) || 0,
            paymentType: data.paymentType,
            remark: data.remark
          }
        ],
        total_amount: parseFloat(data.total),
        advance_payment: parseFloat(data.advancedPayment) || 0
      };
      const res = await dispatch(createOrderAsync(request));
      if (res?.payload?.data?.success) {
        reset();
      }
    })();
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'item'
  });

  const replaceFieldArr = useFieldArray({
    control,
    name: 'replaceItems'
  });

  const item = useWatch({
    control,
    name: 'item'
  });

  const replaceItem = useWatch({
    control,
    name: 'replaceItems'
  });

  const taxRate = watch('taxRate');
  const discount = watch('discount');

  useEffect(() => {
    let total = 0;
    item.forEach((field) => {
      const price = parseFloat(field.price) || field?.target?.value || 0;
      total += price;
    });
    const taxAmount = parseFloat(
      (parseFloat(total) * parseFloat(taxRate)) / 100
    );
    const grandTotal = taxAmount + parseFloat(total);
    setValue('taxAmount', taxAmount);
    setValue('subTotal', total);
    setValue('total', grandTotal);
  }, [item]);

  useEffect(() => {
    let total = 0;
    replaceItem.forEach((field) => {
      const price = parseFloat(field.price) || field?.target?.value || 0;
      total += price;
    });
    setReplaceItemsTotal(total);
  }, [replaceItem]);

  useEffect(() => {
    const totalAmount = watch('subTotal');
    const taxAmount =
      (parseFloat(totalAmount) * (parseFloat(taxRate) || 0)) / 100;
    const total = taxAmount + parseFloat(totalAmount);
    setValue('taxAmount', taxAmount);
    setValue('total', total);
  }, [taxRate]);

  useEffect(() => {
    const total =
      parseFloat(watch('subTotal')) +
      watch('taxAmount') -
      (parseFloat(discount) || 0);
    setValue('total', total);
  }, [discount]);

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
                  <CardHeader avatar={<BackButton />} title="Create Order" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
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
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="remark"
                          label="Remark"
                          fullWidth
                          {...register('remark')}
                          error={Boolean(errors?.remark)}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="customerMobile"
                          label="Customer Mobile"
                          fullWidth
                          {...register('customerMobile')}
                          error={Boolean(errors?.customerMobile)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="address"
                          label="Customer Address"
                          fullWidth
                          {...register('address', {
                            required: true
                          })}
                          error={Boolean(errors?.address)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h4" mb={2}>
                          Items
                        </Typography>
                        <Grid container spacing={2}>
                          {fields.map((field, index) => (
                            <Grid item xs={12} key={field.id}>
                              <Grid container spacing={2}>
                                <Grid item xs={8} md={2}>
                                  <TextField
                                    name={`item.${index}.name`}
                                    label="Item Name"
                                    fullWidth
                                    {...register(`item.${index}.name`, {
                                      required: true
                                    })}
                                    error={Boolean(errors?.item?.[index]?.name)}
                                  />
                                </Grid>
                                <Grid item xs={4} md={1}>
                                  <FormControl fullWidth>
                                    <InputLabel>Item type</InputLabel>
                                    <Select
                                      label="Item type"
                                      defaultValue="gold"
                                      name={`item.${index}.type`}
                                      {...register(`item.${index}.type`, {
                                        required: true
                                      })}
                                      error={Boolean(
                                        errors?.item?.[index]?.type
                                      )}
                                    >
                                      <MenuItem value="gold">Gold</MenuItem>
                                      <MenuItem value="silver">Silver</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={3} md={1}>
                                  <TextField
                                    label="Quantity"
                                    fullWidth
                                    type="number"
                                    name={`item.${index}.quantity`}
                                    {...register(`item.${index}.quantity`, {
                                      required: true
                                    })}
                                    error={Boolean(
                                      errors?.item?.[index]?.qauntity
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={3} md={1}>
                                  <TextField
                                    label="Weight/gm"
                                    fullWidth
                                    type="number"
                                    name={`item.${index}.weight`}
                                    {...register(`item.${index}.weight`, {
                                      required: true
                                    })}
                                    error={Boolean(
                                      errors?.item?.[index]?.weight
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={6} md={1.5}>
                                  <TextField
                                    label="Design"
                                    type="text"
                                    fullWidth
                                    name={`item.${index}.design`}
                                    {...register(`item.${index}.design`)}
                                    error={Boolean(
                                      errors?.item?.[index]?.design
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={4} md={1.5}>
                                  <TextField
                                    label="Rate"
                                    type="number"
                                    fullWidth
                                    name={`item.${index}.itemRate`}
                                    {...register(`item.${index}.itemRate`, {
                                      required: true
                                    })}
                                    error={Boolean(
                                      errors?.item?.[index]?.itemRate
                                    )}
                                  />
                                </Grid>

                                <Grid item xs={4} md={1.5}>
                                  <TextField
                                    label="Labour Charge"
                                    type="number"
                                    fullWidth
                                    name={`item.${index}.labour`}
                                    {...register(`item.${index}.labour`)}
                                    error={Boolean(
                                      errors?.item?.[index]?.labour
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={4} md={1.5}>
                                  <TextField
                                    label="Price"
                                    type="number"
                                    fullWidth
                                    name={`item.${index}.price`}
                                    {...register(`item.${index}.price`, {
                                      required: true
                                    })}
                                    error={Boolean(
                                      errors?.item?.[index]?.price
                                    )}
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
                                      onClick={() =>
                                        append({
                                          name: '',
                                          type: 'gold',
                                          quantity: 1,
                                          weight: '',
                                          price: '',
                                          design: '',
                                          labour: ''
                                        })
                                      }
                                    >
                                      <Add />
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
                                      <DeleteOutlineTwoTone />
                                    </Button>
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h4" mb={2}>
                          Replacement Items
                        </Typography>
                        <Grid container spacing={2}>
                          {replaceFieldArr?.fields?.map((field, index) => (
                            <Grid item xs={12} key={field.id}>
                              <Grid container spacing={2}>
                                <Grid item xs={8} md={4}>
                                  <TextField
                                    name={`replaceItems.${index}.name`}
                                    label="Item Name"
                                    fullWidth
                                    {...register(`replaceItems.${index}.name`)}
                                  />
                                </Grid>
                                <Grid item xs={4} md={2}>
                                  <FormControl fullWidth>
                                    <InputLabel>Item type</InputLabel>
                                    <Select
                                      label="Item type"
                                      defaultValue="gold"
                                      name={`replaceItems.${index}.type`}
                                      {...register(
                                        `replaceItems.${index}.type`
                                      )}
                                    >
                                      <MenuItem value="gold">Gold</MenuItem>
                                      <MenuItem value="silver">Silver</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={4} md={2}>
                                  <TextField
                                    label="Weight/gm"
                                    fullWidth
                                    type="number"
                                    name={`replaceItems.${index}.weight`}
                                    {...register(
                                      `replaceItems.${index}.weight`
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={8} md={3}>
                                  <TextField
                                    label="Price"
                                    type="number"
                                    fullWidth
                                    name={`replaceItems.${index}.price`}
                                    {...register(`replaceItems.${index}.price`)}
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
                                      onClick={() =>
                                        replaceFieldArr?.append({
                                          name: '',
                                          type: 'gold',
                                          weight: '',
                                          price: ''
                                        })
                                      }
                                    >
                                      <Add />
                                    </Button>
                                  ) : (
                                    <Button
                                      fullWidth
                                      variant="outlined"
                                      color="error"
                                      sx={{
                                        height: '100%'
                                      }}
                                      onClick={() =>
                                        replaceFieldArr?.remove(index)
                                      }
                                    >
                                      <DeleteOutlineTwoTone />
                                    </Button>
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
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
                                      type="number"
                                      fullWidth
                                      name="advancedPayment"
                                      placeholder="Enter amount"
                                      {...register('advancedPayment')}
                                      error={Boolean(errors?.advancedPayment)}
                                    />
                                  </Grid>
                                </>
                              )}

                              <Grid item xs={6}>
                                <Typography>Replacement Items Total</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography textAlign="right">
                                  {RUPEE_SYMBOL}{' '}
                                  {replaceItemsTotal?.toLocaleString()}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography>Sub Total</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography textAlign="right">
                                  {RUPEE_SYMBOL}{' '}
                                  {watch('subTotal')?.toLocaleString()}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography>
                                  Tax Rate{' '}
                                  <Typography variant="caption">
                                    (in percentage)
                                  </Typography>
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  type="number"
                                  fullWidth
                                  name="taxRate"
                                  {...register('taxRate', {
                                    required: true
                                  })}
                                  error={Boolean(errors?.taxRate)}
                                />
                              </Grid>
                              {watch('isFullPayment') && (
                                <>
                                  <Grid item xs={6}>
                                    <Typography>Discount</Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <TextField
                                      type="number"
                                      fullWidth
                                      name="discount"
                                      {...register('discount', {
                                        required: true
                                      })}
                                      error={Boolean(errors?.discount)}
                                    />
                                  </Grid>
                                </>
                              )}
                              <Grid item xs={6}>
                                <Typography variant="h4">
                                  Total
                                  <Typography variant="caption">
                                    &nbsp;(Tax included)
                                  </Typography>
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography textAlign="right" variant="h4">
                                  {RUPEE_SYMBOL}{' '}
                                  {watch('total')?.toLocaleString()}
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
