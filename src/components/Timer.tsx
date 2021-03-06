import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { Feather } from "@expo/vector-icons";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "../../styles";
import useInterval from "../utilities/hooks/UseInterval";
import { formatTime } from "../utilities/helpers";

interface ITimerProps {
  duration: number;
  navigation: any;
  screenHidden: boolean;
}

const Timer = ({ duration, navigation, screenHidden }: ITimerProps) => {
  const [count, setCount] = useState<number>(duration + 1);
  const [paused, setPaused] = useState<boolean>(false);
  const [starting, setStarting] = useState<boolean>(true);
  let playbackInstance: null | Audio.Sound = null;

  //Incrementer
  const incrementTimer = () => {
    if (count === 0) {
      navigation.navigate("Completion", {
        duration: duration,
      });
      playbackInstance?.unloadAsync();
      return;
    }
    setCount(count - 1);
  };

  //Start timer
  useInterval(incrementTimer, paused || starting ? null : 1000);

  //Ring the bell
  useEffect(() => {
    const ringBell = async () => {
      const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync(require("../../assets/bell.mp3"));
        await soundObject.playAsync();
      } catch (error) {
        console.error(error);
      }
    };
    setTimeout(() => {
      setStarting(false);
      ringBell();
    }, 1400);
  }, []);

  const onPlayPausePressed = () => {
    setPaused(!paused);
  };

  const discardPressed = () => {
    navigation.navigate("Home");
  };

  const finishEarlyPressed = () => {
    navigation.navigate("Completion", {
      duration: duration - count,
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(count)}</Text>
      <View style={styles.horizontalContainer}>
        <TouchableOpacity onPress={discardPressed} disabled={screenHidden}>
          {paused ? <Feather name="trash" color="white" size={36} /> : null}
        </TouchableOpacity>
        <TouchableOpacity  onPress={onPlayPausePressed} disabled={screenHidden}>
          {paused ? (
            <Feather name="play" color="white" size={36} />
          ) : (
            <Feather name="pause" color="white" size={36} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={finishEarlyPressed} disabled={screenHidden}>
          {paused ? <Feather name="check" color="white" size={36} /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Timer;
