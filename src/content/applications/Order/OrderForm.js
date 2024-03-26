import { Add, DeleteOutlineTwoTone } from '@mui/icons-material';
import {
  LoadingButton,
  LocalizationProvider,
  MobileDatePicker
} from '@mui/lab';
import AdapterMoment from '@mui/lab/AdapterMoment';
import {
  Box,
  Button,
  Card,
  CardContent,
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
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { RUPEE_SYMBOL, TYPES } from 'src/utils/constants';

const OrderForm = ({ onSubmit, defaultValue }) => {
  const { id } = useParams();
  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValue || {
      isFullPayment: true,
      dispatch: false,
      taxRate: 3,
      discount: 0,
      date: moment(),
      dueDate: moment(),
      item: [
        {
          name: '',
          type: 'gold',
          quantity: 1,
          weight: '',
          price: '',
          design: '',
          labour: '',
          rate: ''
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

  const [submitLoading, setSubmitLoading] = useState(false);

  const navigate = useNavigate();

  const formSubmit = async (data) => {
    setSubmitLoading(true);
    const res = await onSubmit(data);
    if (res?.payload?.data?.success) {
      reset();
      navigate(-1);
    }
    setSubmitLoading(false);
  };

  const [replaceItemsTotal, setReplaceItemsTotal] = useState(0);

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
    item?.forEach((field) => {
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
    replaceItem?.forEach((field) => {
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

  const disabledWhenCompleted = defaultValue?.total > 0;

  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            name="customerName"
            label="Customer Name"
            fullWidth
            {...register('customerName', {
              required: true
            })}
            disabled={id}
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
            disabled={id}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name="customerMobile"
            label="Customer Mobile"
            fullWidth
            {...register('customerMobile')}
            error={Boolean(errors?.customerMobile)}
            disabled={id}
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
            disabled={id}
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
                  <Grid item xs={8} md={1.5}>
                    <TextField
                      name={`item.${index}.name`}
                      label="Item Name"
                      fullWidth
                      {...register(`item.${index}.name`, {
                        required: true
                      })}
                      disabled={disabledWhenCompleted}
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
                        disabled={disabledWhenCompleted}
                        error={Boolean(errors?.item?.[index]?.type)}
                      >
                        {TYPES?.map((type, index) => (
                          <MenuItem key={index} value={type?.value}>
                            {type?.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3} md={1}>
                    <TextField
                      label="Quantity"
                      fullWidth
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      name={`item.${index}.quantity`}
                      {...register(`item.${index}.quantity`, {
                        required: true
                      })}
                      disabled={disabledWhenCompleted}
                      error={Boolean(errors?.item?.[index]?.qauntity)}
                    />
                  </Grid>
                  <Grid item xs={3} md={1}>
                    <TextField
                      label="Weight/gm"
                      fullWidth
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      inputProps={{
                        step: 'any'
                      }}
                      name={`item.${index}.weight`}
                      {...register(`item.${index}.weight`, {
                        required: true
                      })}
                      disabled={disabledWhenCompleted}
                      error={Boolean(errors?.item?.[index]?.weight)}
                    />
                  </Grid>
                  <Grid item xs={6} md={1}>
                    <TextField
                      label="Design"
                      type="text"
                      fullWidth
                      name={`item.${index}.design`}
                      {...register(`item.${index}.design`)}
                      disabled={disabledWhenCompleted}
                      error={Boolean(errors?.item?.[index]?.design)}
                    />
                  </Grid>
                  <Grid item xs={4} md={1.5}>
                    <TextField
                      label="Rate"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      fullWidth
                      inputProps={{
                        step: 'any'
                      }}
                      name={`item.${index}.rate`}
                      {...register(`item.${index}.rate`, {
                        required: true
                      })}
                      disabled={disabledWhenCompleted}
                      error={Boolean(errors?.item?.[index]?.rate)}
                    />
                  </Grid>
                  <Grid item xs={4} md={1.5}>
                    <TextField
                      label="Price"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      fullWidth
                      inputProps={{
                        step: 'any'
                      }}
                      name={`item.${index}.itemRate`}
                      {...register(`item.${index}.itemRate`, {
                        required: true
                      })}
                      disabled={disabledWhenCompleted}
                      error={Boolean(errors?.item?.[index]?.itemRate)}
                    />
                  </Grid>
                  <Grid item xs={4} md={1.2}>
                    <TextField
                      label="Labour Charge"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      fullWidth
                      name={`item.${index}.labour`}
                      {...register(`item.${index}.labour`, {
                        required: true
                      })}
                      disabled={disabledWhenCompleted}
                      error={Boolean(errors?.item?.[index]?.labour)}
                    />
                  </Grid>
                  <Grid item xs={4} md={1.5}>
                    <TextField
                      label="Item Total"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      fullWidth
                      inputProps={{
                        step: 'any'
                      }}
                      name={`item.${index}.price`}
                      {...register(`item.${index}.price`, {
                        required: true
                      })}
                      disabled={disabledWhenCompleted}
                      error={Boolean(errors?.item?.[index]?.price)}
                    />
                  </Grid>
                  <Grid item xs={12} md={0.5}>
                    {index === 0 ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          height: '100%'
                        }}
                        disabled={disabledWhenCompleted}
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
                        disabled={disabledWhenCompleted}
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
                      disabled={disabledWhenCompleted}
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
                        disabled={disabledWhenCompleted}
                        {...register(`replaceItems.${index}.type`)}
                      >
                        {TYPES?.map((type, index) => (
                          <MenuItem key={index} value={type?.value}>
                            {type?.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      label="Weight/gm"
                      fullWidth
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      inputProps={{
                        step: 'any'
                      }}
                      name={`replaceItems.${index}.weight`}
                      disabled={disabledWhenCompleted}
                      {...register(`replaceItems.${index}.weight`)}
                    />
                  </Grid>
                  <Grid item xs={8} md={3}>
                    <TextField
                      label="Price"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      fullWidth
                      inputProps={{
                        step: 'any'
                      }}
                      name={`replaceItems.${index}.price`}
                      disabled={disabledWhenCompleted}
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
                        disabled={disabledWhenCompleted}
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
                        disabled={disabledWhenCompleted}
                        onClick={() => replaceFieldArr?.remove(index)}
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
                  <Typography>Date</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => {
                      return (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <MobileDatePicker
                            {...field}
                            label="Date"
                            onAccept={field.onChange}
                            onChange={() => {}}
                            disabled={disabledWhenCompleted}
                            inputFormat="DD/MM/yyyy"
                            renderInput={(props) => {
                              return (
                                <TextField
                                  {...props}
                                  fullWidth
                                  label=""
                                  placeholder="Select date"
                                  inputProps={{
                                    ...props.inputProps,
                                    placeholder: 'Select date'
                                  }}
                                />
                              );
                            }}
                          />
                        </LocalizationProvider>
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography>Due Date</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => {
                      return (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <MobileDatePicker
                            {...field}
                            label="Due Date"
                            onAccept={field.onChange}
                            onChange={() => {}}
                            inputFormat="DD/MM/yyyy"
                            disabled={disabledWhenCompleted}
                            renderInput={(props) => {
                              return (
                                <TextField
                                  {...props}
                                  fullWidth
                                  label=""
                                  placeholder="Select date"
                                  inputProps={{
                                    ...props.inputProps,
                                    placeholder: 'Select date'
                                  }}
                                />
                              );
                            }}
                          />
                        </LocalizationProvider>
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography>Full Payment</Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    {...register(`isFullPayment`)}
                    disabled={disabledWhenCompleted}
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
                      disabled={disabledWhenCompleted}
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
                <Grid item xs={6}>
                  <Typography>Delivery</Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    {...register(`dispatch`)}
                    checked={watch('dispatch')}
                  />
                </Grid>
                {!watch('isFullPayment') && (
                  <>
                    <Grid item xs={6}>
                      <Typography>Advanced Payment</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        fullWidth
                        disabled={id}
                        name="advancedPayment"
                        inputProps={{
                          step: 'any'
                        }}
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
                    {RUPEE_SYMBOL} {replaceItemsTotal?.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Sub Total</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography textAlign="right">
                    {RUPEE_SYMBOL} {watch('subTotal')?.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    Tax Rate{' '}
                    <Typography variant="caption">(in percentage)</Typography>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    fullWidth
                    name="taxRate"
                    inputProps={{
                      step: 'any'
                    }}
                    disabled={disabledWhenCompleted}
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
                        onWheel={(e) => e.target.blur()}
                        fullWidth
                        name="discount"
                        disabled={disabledWhenCompleted}
                        inputProps={{
                          step: 'any'
                        }}
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
                    {RUPEE_SYMBOL} {watch('total')?.toLocaleString()}
                  </Typography>
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
    </form>
  );
};

export default OrderForm;
