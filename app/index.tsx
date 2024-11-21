import { Pressable, Text, View } from "react-native";
import Welcome from "../components/Welcome"
import Login from "../components/Login"
import Signup from "../components/Signup"
import { Link } from "expo-router";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        
      }}
    >
      {/* <Welcome/> */}
      {/* <Login/> */}
      <Signup/>
      
    </View>
  );
}
