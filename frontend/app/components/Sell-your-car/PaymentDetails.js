import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Box
} from '@mui/material';

const PaymentsStep = () => {
  const { control, watch } = useFormContext();
  const paymentMethod = watch('payment_method');

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Select Payment Method</FormLabel>
        <Controller
          name="payment_method"
          control={control}
          defaultValue=""
          rules={{ required: 'Please select a payment method' }}
          render={({ field }) => (
            <RadioGroup {...field} row>
              <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
              <FormControlLabel value="bank" control={<Radio />} label="Bank Transfer" />
              <FormControlLabel value="card" control={<Radio />} label="Credit / Debit Card" />
            </RadioGroup>
          )}
        />
      </FormControl>

      {/* COD message */}
      {paymentMethod === 'cod' && (
        <Typography variant="body1">
          You have selected <strong>Cash on Delivery</strong>. Please be available to make the payment at the time of inspection.
        </Typography>
      )}

      {/* Bank Transfer Info */}
      {paymentMethod === 'bank' && (
        <Box>
          <Typography variant="h6">Bank Transfer Instructions</Typography>
          <Typography variant="body2">Bank Name: Carmandi Bank Ltd.</Typography>
          <Typography variant="body2">Account Number: 123456789</Typography>
          <Typography variant="body2">Account Title: Carmandi Pvt Ltd.</Typography>
          <Typography variant="body2">IBAN: PK12CARM1234567890001</Typography>
        </Box>
      )}

      {/* Credit/Debit Card Fields */}
      {paymentMethod === 'card' && (
        <Box display="flex" flexDirection="column" gap={2}>
          <Controller
            name="card_number"
            control={control}
            rules={{
              required: 'Card number is required',
              pattern: {
                value: /^\d{16}$/,
                message: 'Card number must be 16 digits'
              }
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Card Number"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                inputProps={{ maxLength: 16 }}
              />
            )}
          />

          <Controller
            name="card_expiry"
            control={control}
            rules={{
              required: 'Expiry date is required',
              pattern: {
                value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                message: 'Format should be MM/YY'
              }
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Expiry Date (MM/YY)"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="card_cvv"
            control={control}
            rules={{
              required: 'CVV is required',
              pattern: {
                value: /^\d{3}$/,
                message: 'CVV must be 3 digits'
              }
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="CVV"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                inputProps={{ maxLength: 3 }}
              />
            )}
          />

          <Controller
            name="card_holder"
            control={control}
            rules={{ required: 'Cardholder name is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Cardholder Name"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default PaymentsStep;
