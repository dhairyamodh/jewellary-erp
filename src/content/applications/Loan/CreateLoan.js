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
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import BackButton from 'src/components/BackButton';
import { createLoanAsync } from 'src/redux/Loan/loanThunk';
import { RUPEE_SYMBOL } from 'src/utils/constants';

const CreateLoan = () => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      item: [
        {
          name: '',
          type: 'gold',
          quantity: 1,
          weight: '',
          price: ''
        }
      ]
    }
  });

  const dispatch = useDispatch();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [itemsTotal, setItemsTotal] = useState(0);

  const onSubmit = (data) => {
    (async () => {
      setSubmitLoading(true);
      const request = {
        customerName: data.customerName,
        customerMobile: data.customerMobile,
        customerAddress: data.address,
        items: data.item.map((i) => {
          return {
            name: i?.name,
            type: i.type,
            quantity: parseInt(i.qauntity || 1),
            weight: parseFloat(i.weight),
            itemCost: parseFloat(i.price)
          };
        }),
        totalItemCost: itemsTotal,
        loanCost: parseFloat(data.loanCost),
        interestRate: parseFloat(data.interestRate)
      };
      const res = await dispatch(createLoanAsync(request));
      if (res?.payload?.data?.success) {
        reset();
      }
      setSubmitLoading(false);
    })();
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
    setItemsTotal(total);
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
                  <CardHeader avatar={<BackButton />} title="Create Loan" />
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
                          {...register('customerMobile')}
                          error={Boolean(errors?.customerMobile)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
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
                        <h3>Items</h3>
                        <Grid container spacing={2}>
                          {fields.map((field, index) => (
                            <Grid item xs={12} key={field.id}>
                              <Grid container spacing={2}>
                                <Grid item xs={8} md={3}>
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
                                <Grid item xs={4} md={2}>
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
                                <Grid item xs={3} md={1.5}>
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
                                <Grid item xs={3} md={1.5}>
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
                                <Grid item xs={6} md={3}>
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
                                          weight: ''
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
                      <Grid item xs={12} md={6}>
                        {/* <Grid container spacing={2}></Grid> */}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={6}>
                                <Typography variant="h4">
                                  Items Total
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography textAlign="right" variant="h4">
                                  {RUPEE_SYMBOL} {itemsTotal?.toLocaleString()}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography>Loan Cost</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  placeholder="Enter loan cost"
                                  type="number"
                                  fullWidth
                                  name="loanCost"
                                  {...register('loanCost', {
                                    required: true
                                  })}
                                  error={Boolean(errors?.loanCost)}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Typography>
                                  Interest Rate{' '}
                                  <Typography variant="caption">
                                    (percentage %)
                                  </Typography>
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  placeholder="Enter interest rate"
                                  type="number"
                                  fullWidth
                                  name="interestRate"
                                  {...register('interestRate', {
                                    required: true
                                  })}
                                  error={Boolean(errors?.interestRate)}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="end">
                          <LoadingButton
                            loading={submitLoading}
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

export default CreateLoan;
