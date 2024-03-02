import { Add, DeleteOutlineTwoTone } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
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
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RUPEE_SYMBOL } from 'src/utils/constants';

const OrderForm = ({ onSubmit, defaultValue }) => {
  const { id } = useParams();
  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValue || {
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
          labour: '',
          itemRate: ''
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

  const setting = useSelector((state) => state.setting);
  const { goldRate, silverRate } = setting.data;

  const navigate = useNavigate();

  const formSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      const res = await onSubmit(data);
      if (res?.payload?.data?.success) {
        reset();
        navigate(-1);
      }
      setSubmitLoading(false);
    } catch (error) {
      setSubmitLoading(false);
    }
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

  const calculateRate = useMemo(
    () => (weightInGrams, type) => {
      if (type === 'gold') {
        return (weightInGrams / 10) * goldRate;
      }
      return (weightInGrams / 10) * silverRate;
    },
    []
  );

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
    setValue('total', total.toFixed(2));
  }, [taxRate]);

  useEffect(() => {
    const total =
      parseFloat(watch('subTotal')) +
      watch('taxAmount') -
      (parseFloat(discount) || 0);
    setValue('total', total.toFixed(2));
  }, [discount]);
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
            {fields.map((field, index) => {
              return (
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
                        <Controller
                          name={`item[${index}].type`}
                          control={control}
                          rules={{ required: true }}
                          defaultValue={item.type || 'gold'}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="Item type"
                              defaultValue="gold"
                              name={`item.${index}.type`}
                              onChange={(e) => {
                                const type = e.target.value;
                                const weight = parseFloat(
                                  getValues(`item[${index}].weight`)
                                );
                                const quantity = getValues(
                                  `item[${index}].quantity`
                                );
                                if (quantity > 0 && weight) {
                                  const newRate =
                                    calculateRate(weight, type) * quantity;
                                  const labourChar =
                                    parseFloat(
                                      getValues(`item[${index}].labour`)
                                    ) || 0;
                                  setValue(
                                    `item[${index}].itemRate`,
                                    newRate.toFixed(2)
                                  );
                                  setValue(
                                    `item[${index}].price`,
                                    (newRate + labourChar).toFixed(2)
                                  );
                                }
                                field.onChange(e);
                              }}
                              error={Boolean(errors?.item?.[index]?.type)}
                            >
                              <MenuItem value="gold">Gold</MenuItem>
                              <MenuItem value="silver">Silver</MenuItem>
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} md={1}>
                      <Controller
                        name={`item[${index}].quantity`}
                        control={control}
                        rules={{ required: true }}
                        defaultValue={item.qauntity || 1}
                        render={({ field }) => {
                          return (
                            <TextField
                              {...field}
                              label="Quantity"
                              fullWidth
                              type="number"
                              name={`item.${index}.quantity`}
                              inputProps={{
                                min: 1
                              }}
                              onChange={(e) => {
                                const quantity = parseFloat(e.target.value);
                                const weight = parseFloat(
                                  getValues(`item[${index}].weight`)
                                );
                                if (quantity > 0 && weight) {
                                  const type = getValues(`item[${index}].type`);
                                  const newRate =
                                    calculateRate(weight, type) * quantity;
                                  const labourChar =
                                    parseFloat(
                                      getValues(`item[${index}].labour`)
                                    ) || 0;
                                  setValue(
                                    `item[${index}].itemRate`,
                                    newRate.toFixed(2)
                                  );
                                  setValue(
                                    `item[${index}].price`,
                                    (newRate + labourChar).toFixed(2)
                                  );
                                }
                                field.onChange(e);
                              }}
                              error={Boolean(errors?.item?.[index]?.qauntity)}
                            />
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs={3} md={1}>
                      <Controller
                        name={`item[${index}].weight`}
                        control={control}
                        rules={{ required: true }}
                        defaultValue={item.weight || ''}
                        render={({ field }) => (
                          <TextField
                            label="Weight/gm"
                            fullWidth
                            type="number"
                            name={`item.${index}.weight`}
                            onChange={(e) => {
                              const newWeight = parseFloat(e.target.value);
                              const quantity = parseFloat(
                                getValues(`item[${index}].quantity`)
                              );
                              const type = getValues(`item[${index}].type`);
                              const newRate =
                                calculateRate(newWeight, type) * quantity;
                              const labourChar =
                                parseFloat(
                                  getValues(`item[${index}].labour`)
                                ) || 0;
                              setValue(
                                `item[${index}].itemRate`,
                                newRate.toFixed(2)
                              );
                              setValue(
                                `item[${index}].price`,
                                (newRate + labourChar).toFixed(2)
                              );
                              field.onChange(e);
                            }}
                            error={Boolean(errors?.item?.[index]?.weight)}
                          />
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
                        error={Boolean(errors?.item?.[index]?.design)}
                      />
                    </Grid>
                    <Grid item xs={4} md={1.5}>
                      <Controller
                        name={`item[${index}].itemRate`}
                        control={control}
                        rules={{ required: 'Item rate is required' }}
                        defaultValue={item.itemRate || ''}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Rate"
                            type="number"
                            fullWidth
                            name={`item.${index}.itemRate`}
                            onChange={(e) => {
                              const rate = parseFloat(e.target.value);
                              const labourChar =
                                parseFloat(
                                  getValues(`item[${index}].labour`)
                                ) || 0;
                              setValue(
                                `item[${index}].price`,
                                (rate + labourChar).toFixed(2)
                              );
                              field.onChange(e);
                            }}
                            error={Boolean(errors?.item?.[index]?.itemRate)}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={4} md={1.5}>
                      <Controller
                        name={`item[${index}].labour`}
                        control={control}
                        rules={{ required: true }}
                        defaultValue={item.labour || ''}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Labour Charge"
                            type="number"
                            fullWidth
                            name={`item.${index}.labour`}
                            onChange={(e) => {
                              const labourChar = parseFloat(e.target.value);
                              const rate =
                                parseFloat(
                                  getValues(`item[${index}].itemRate`)
                                ) || 0;
                              if (labourChar) {
                                setValue(
                                  `item[${index}].price`,
                                  (rate + labourChar).toFixed(2)
                                );
                              }
                              field.onChange(e);
                            }}
                            error={Boolean(errors?.item?.[index]?.labour)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} md={1.5}>
                      <Controller
                        name={`item[${index}].price`}
                        control={control}
                        rules={{ required: true }}
                        defaultValue={item.price || ''}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Price"
                            type="number"
                            fullWidth
                            inputProps={{
                              readOnly: true
                            }}
                            name={`item.${index}.price`}
                            error={Boolean(errors?.item?.[index]?.price)}
                          />
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
              );
            })}
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
                        {...register(`replaceItems.${index}.type`)}
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
                      {...register(`replaceItems.${index}.weight`)}
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
