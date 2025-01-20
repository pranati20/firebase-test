import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from '../components/Welcome';
import Signup from '../components/Signup';
import Login from '../components/Login';
import SlotManage from '../components/SlotManage';
import VenueOptions from '../components/VenueOptions';
import SelectCourt from '../components/SelectCourt';
import SelectCourtEx from '../components/SelectCourtEx';
import CourtImages from '../components/CourtImages';
import VenueDetails from '../components/VenueDetails';
import LoginInitial from '../components/LoginInitial';
import ForgotPassword from '../components/ForgotPassword'


const Stack = createStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={Welcome} />

    <Stack.Screen name="VenueOptions" component={VenueOptions} /> 
       {/* <Stack.Screen name="SelectCourt" component={SelectCourt} />  */}
      {/* <Stack.Screen name="Logintest" component={Logintest} /> */}
      <Stack.Screen name="VenueDetails" component={VenueDetails} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} />
      {/* <Stack.Screen name="SlotManage" component={SlotManage} />  */}
      {/* <Stack.Screen name="SelectCourtEx" component={SelectCourtEx} /> */}
      {/* <Stack.Screen name="CourtImages" component={CourtImages} /> */}
      <Stack.Screen name="LoginInitial" component={LoginInitial} /> 
     <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> 


    </Stack.Navigator>
  );
}



