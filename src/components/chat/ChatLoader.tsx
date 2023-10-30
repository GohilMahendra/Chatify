import React,{useRef,useEffect} from "react";
import {Animated,Easing,View} from "react-native";
const ChatLoader = () =>
{

    const dot1 = useRef(new Animated.Value(1)).current
    const dot2 = useRef(new Animated.Value(1)).current
    const dot3 = useRef(new Animated.Value(1)).current

    const animate = () =>
    {
        Animated.loop(
            Animated.sequence([
              Animated.timing(dot1, {
                toValue: 1.5,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: false,
              }),
              Animated.timing(dot1, {
                toValue: 0.5,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: false,
              }),
              Animated.timing(dot2, {
                toValue: 1.5,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: false,
              }),
              Animated.timing(dot2, {
                toValue: 0.5,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: false,
              }),
              Animated.timing(dot3, {
                toValue: 1.5,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: false,
              }),
              Animated.timing(dot3, {
                toValue: 0.5,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: false,
              }),
            ])
          ).start();
      
    }

    useEffect(()=>{
        animate()
    },[])

    return(
        <View style={{ flexDirection: 'row',alignSelf:"center", alignItems: 'center' }}>
        <Animated.View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#3498db',
            margin: 5,
            transform: [{ scale: dot1 }],
          }}
        />
        <Animated.View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#3498db',
            margin: 5,
            transform: [{ scale: dot2}],
          }}
        />
        <Animated.View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#3498db',
            margin: 5,
            transform: [{ scale: dot3 }],
          }}
        />
      </View>
    )

}
export default ChatLoader