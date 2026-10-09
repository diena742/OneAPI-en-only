// WechatModal.js
import PropTypes from 'prop-types';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography, Grid } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { showError } from 'utils/common';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  code: Yup.string().required('Verification code cannot be empty')
});

const WechatModal = ({ open, handleClose, wechatLogin, qrCode }) => {
  const handleSubmit = (values) => {
    const { success, message } = wechatLogin(values.code);
    if (success) {
      handleClose();
    } else {
      showError(message || 'Unknown error');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>WeChat Verification Code Login</DialogTitle>
      <DialogContent>
        <Grid container direction="column" alignItems="center">
          <img src={qrCode} alt="QR code" style={{ maxWidth: '300px', maxHeight: '300px', width: 'auto', height: 'auto' }} />
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ marginTop: '10px', textAlign: 'center', wordWrap: 'break-word', maxWidth: '300px' }}
          >
            Please scan the QR code with WeChat and follow the official account, then enter the verification code to receive it (valid for 3 minutes)
          </Typography>
          <Formik initialValues={{ code: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, touched }) => (
              <Form style={{ width: '100%' }}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="code"
                    label="Verification Code"
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" fullWidth>
                    Submit
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default WechatModal;

WechatModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  wechatLogin: PropTypes.func,
  qrCode: PropTypes.string
};
