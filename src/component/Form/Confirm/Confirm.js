import React, { useEffect } from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import * as actionApp from '../../../store/actions/index';
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
// Components
import {
  Spacer,
  ScFlexBox,
  ScCard,
  ScHeader,
  ScTextBox,
  ScFlexItem,
  ScButton,
} from '../../UI/Styled';
import { IncomeSource } from '../Income/components/IncomeSource';
// Misc.
import { formatPhoneNumber } from '../../../helper';
import { HEADER_FORMAT_1, CARD_FORMAT_1, CARD_FORMAT_2 } from '../../../constants';
import { ProgressBar } from '../../ProgressBar/ProgressBar';

const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const appDate = new Date();
const appDateFormatted = `${appDate.getMonth() + 1}/${appDate.getDate()}/${appDate.getFullYear()}`;
const appNumber = Math.round(Math.random() * 500000);

const FormConfirm = ({ pathNext, pathPrev, history }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const tokenREDUX = useSelector((state) => state.auth.token);
  const userIdREDUX = useSelector((state) => state.auth.userId);
  const loadingREDUX = useSelector((state) => state.userApps.loading);
  const errorREDUX = useSelector((state) => state.userApps.error);
  const personalDataREDUX = useSelector((state) => state.application.personalData);
  const incomeDataREDUX = useSelector((state) => state.application.incomeData);
  const onSubmitApplication = (token, personalData, incomeData) =>
    dispatch(actionApp.submitApplication(token, personalData, incomeData));
  const onClearApplicationData = () => dispatch(actionApp.clearApplicationData());

  const nextStep = () => {
    history.push({ pathname: pathNext });
  };

  const prevStep = () => {
    history.push({ pathname: pathPrev });
  };

  useEffect(() => {
    const sessionPersonalData = sessionStorage.getItem('sessionPersonalData');
    const parsedPersonalData = JSON.parse(sessionPersonalData);
    const sessionIncomeData = sessionStorage.getItem('sessionIncomeData');
    const parsedIncomeData = JSON.parse(sessionIncomeData);
    // if session storage has data and Redux state is empty (meaning browser was refreshed), retore Redux state with session data
    if (parsedPersonalData && !personalDataREDUX.phone.value) {
      dispatch(actionApp.setPersonalData(parsedPersonalData));
    }
    if (sessionIncomeData && !incomeDataREDUX.length) {
      dispatch(actionApp.setIncomeArray(parsedIncomeData));
    }
  }, []);

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
      sessionStorage.clear();
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
    <>
      <ProgressBar />
      <ScCard width={50} shadow="SmoothXs">
        <Spacer>
          <ScHeader as="h2" fontSize={3} fontWeight={500} color="secondary" mBot={1} mTop={1}>
            Confirm Your Information
          </ScHeader>
          <ScTextBox>Review your information before submitting.</ScTextBox>
          <ScHeader as="h3" fontSize={1.8} fontWeight={500} color="grey3" mTop={2} mBot={1}>
            Personal Information
          </ScHeader>
          <ScCard {...CARD_FORMAT_1}>
            <ScFlexBox justify="flex-start">
              {userValueArray.map((item) => {
                return (
                  <ScFlexItem basis="50%" key={item.label}>
                    <ScHeader as="h4" {...HEADER_FORMAT_1}>
                      {item.label}
                    </ScHeader>
                    <ScTextBox padding="0.3rem">
                      {item.label === 'Phone Number' ? formatPhoneNumber(item.value) : item.value}
                    </ScTextBox>
                  </ScFlexItem>
                );
              })}
            </ScFlexBox>
          </ScCard>
        </Spacer>
        <Spacer>
          <ScHeader as="h3" fontSize={1.8} fontWeight={500} color="grey3" mTop={2} mBot={1}>
            Income Sources
          </ScHeader>
          {incomeDataREDUX.map((incomeSource, index) => (
            <Spacer key={index} mTop={0.1} mBot={2}>
              <ScCard {...CARD_FORMAT_2(incomeSource)}>
                <IncomeSource incomeSource={incomeSource} index={index} />
              </ScCard>
            </Spacer>
          ))}

          <Spacer mTop={5}>
            <ScFlexBox justify="space-between">
              <ScButton variant="secondary" width="45%" onClick={prevStep}>
                <KeyboardArrowLeftOutlinedIcon />
                Back
              </ScButton>
              <ScButton
                variant="secondary"
                width="45%"
                type="submit"
                onClick={submitApplicationHandler}
              >
                Confirm
                <KeyboardArrowRightIcon />
                {loadingREDUX && <CircularProgress size={24} className={classes.buttonProgress} />}
              </ScButton>
            </ScFlexBox>
          </Spacer>
        </Spacer>
      </ScCard>
    </>
  );
};

export default FormConfirm;
