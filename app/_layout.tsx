import { useFonts } from "expo-font";
import { Stack, useNavigation } from "expo-router";
import { useEffect } from 'react';
import React from 'react';


export default function RootLayout() {
  
  useFonts({
    'poppins_medium':require('./../assets/fonts/Poppins-Medium.ttf'),
    'poppins_bold':require('./../assets/fonts/Poppins-Bold.ttf'),
    'poppins_semibold':require('./../assets/fonts/Poppins-SemiBold.ttf'),
    'dmsans_regular':require('./../assets/fonts/DMSans-Regular.ttf'),
  })
  
  return (
    <Stack
    screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="index" />
    </Stack>
    
  );
}
