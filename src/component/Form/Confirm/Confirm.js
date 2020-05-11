import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actionUserApp from '../../../store/actions/index';

import { merge } from 'lodash';

import { Button, Typography, Paper, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { customTheme } from '../../../theme';

import CircularProgress from '@material-ui/core/CircularProgress';
import { purple } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import useAppNumberGenerator from '../../../hooks/appNumber-generator';
import classModule from './Confirm.module.css';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '30px',
  },
  header1: {
    padding: '1rem 0',
  },
  header2: {
    padding: '1rem 0',
  },
  box: {
    padding: '0.5rem',
  },
  paper: {
    maxWidth: '600px',
    margin: 'auto',
    borderRadius: '6px',
    padding: theme.spacing(2),
  },
  card: {
    boxShadow: '0 5px 10px -3px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    margin: '0 auto',
  },
  cardContent: {
    padding: '0',
    '&:last-child': {
      paddingBottom: 8,
    },
  },
  spacer: {
    margin: '24px 0',
  },
  button: {
    margin: '1rem',
    backgroundColor: customTheme.palette.primary.dark,
  },
  buttonProgress: {
    color: purple[200],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const FormConfirm = (props) => {
  console.log('<Confirm /> RENDER');
  const classes = useStyles();
  const { pathNext, pathPrev } = props;
  const appNumber = useAppNumberGenerator();

  const dispatch = useDispatch();
  const tokenREDUX = useSelector((state) => state.auth.token);
  const userIdREDUX = useSelector((state) => state.auth.userId);
  const loadingREDUX = useSelector((state) => state.userApps.loading);
  const errorREDUX = useSelector((state) => state.userApps.error);
  const personalDataREDUX = useSelector((state) => state.application.personalData);
  const incomeDataREDUX = useSelector((state) => state.application.incomeData);
  const onSubmitApplication = (token, personalData, incomeData) =>
    dispatch(actionUserApp.submitApplication(token, personalData, incomeData));
  const onClearApplicationData = () => dispatch(actionUserApp.clearApplicationData());

  console.log('token', tokenREDUX);

  const nextStep = () => {
    props.history.push({ pathname: pathNext });
  };

  const prevStep = () => {
    props.history.push({ pathname: pathPrev });
  };

  console.log('personalDataREDUX', personalDataREDUX);

  const appDate = new Date();
  const appDateFormatted = `${
    appDate.getMonth() + 1
  }/${appDate.getDate()}/${appDate.getFullYear()}`;

  const applicationData = {
    userId: userIdREDUX,
    personalData: personalDataREDUX,
    incomeData: incomeDataREDUX,
    appDate: appDateFormatted,
    appNumber: appNumber,
  };

  const submitApplicationHandler = () => {
    onSubmitApplication(tokenREDUX, applicationData);
    if (!errorREDUX) {
      onClearApplicationData();
    }
    nextStep();
  };

  const userValueArray = [];
  for (let key in personalDataREDUX) {
    userValueArray.push({
      id: key,
      label: personalDataREDUX[key].label,
      value: personalDataREDUX[key].value,
    });
  }

  return (
    <div className={classes.root}>
      <Box component="div" className={classes.box}>
        <Paper className={classes.paper} elevation={2}>
          <Typography variant="h5" color="secondary" className={classes.header1}>
            Confirm Your Information
          </Typography>

          <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.cardContent}>
              <div className={classModule.CardHeader}>
                <Typography variant="h6" className={classes.header2}>
                  Personal Information
                </Typography>
              </div>
              <div className={classModule.CardList}>
                <Grid container spacing={3}>
                  {userValueArray.map((item) => {
                    return (
                      <Grid item xs={12} sm={6} key={item.id}>
                        <div className={classModule.CardSection}>
                          <div className={classModule.CardSectionHeader}>{item.label}</div>
                          <div>{item.value}</div>
                        </div>
                      </Grid>
                    );
                  })}
                </Grid>
              </div>
            </CardContent>
          </Card>
          <div className={classes.spacer}>
            {incomeDataREDUX.map((incomeSource, index) => {
              return (
                <div className={classes.spacer} key={index}>
                  <Card variant="outlined" className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <div className={classModule.CardHeader}>
                        <Typography variant="h6" className={classes.header2}>
                          Income Source:{' '}
                          <span className={classModule.Darken}>
                            {incomeSource.employerData.employerName.value ||
                              incomeSource.otherIncomeName.value}
                          </span>
                        </Typography>
                      </div>
                      <div className={classModule.CardBody}>
                        <div className={classModule.CardSection}>
                          <div className={classModule.CardSectionHeader}>Gross Income:</div>
                          <div>{incomeSource.incomeData.grossIncome.value}</div>
                        </div>
                        <div className={classModule.CardSection}>
                          <div className={classModule.CardSectionHeader}>Pay Frequency:</div>
                          <div>{incomeSource.incomeData.payFrequency.value}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </Paper>
      </Box>
      <br />
      <br />
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="large"
        onClick={prevStep}
      >
        Back
      </Button>
      <Button variant="contained" color="secondary" size="large" onClick={submitApplicationHandler}>
        Confirm
      </Button>
      {loadingREDUX && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  );
};

export default FormConfirm;
