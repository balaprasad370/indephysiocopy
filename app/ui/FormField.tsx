import { Pressable, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useColorScheme } from "nativewind";

type PropsType = {
  isTitle: boolean;
  title?: string;
  placeholder: string;
  otherStyle?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  onChangeText?: (text: string) => void;
  value?: string;
};

const FormField = ({
  isTitle,
  title = "field",
  placeholder,
  otherStyle,
  keyboardType = "default",
  onChangeText,
  value,
}: PropsType) => {
  const { colorScheme } = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`   ${otherStyle} pt-2`}>
      {isTitle && (
        <Text className="text-lg font-medium pb-3 dark:text-white">
          {title}
        </Text>
      )}
      <View
        className={` flex-row rounded-xl border-x border-b-2 border-t border-n50 bg-white  
           dark:border-n400 dark:bg-n0 dark:text-white p-2`}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#4A4A4A"
          className=" text-n50 dark:text-white flex-1 text-base"
          secureTextEntry={
            [
              "Password",
              "Old Password",
              "New Password",
              "Confirm Password",
              "New password",
            ].includes(title) && !showPassword
          }
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          value={value}
        />



        {["Password", "Confirm Password", "New password"].includes(title) && (
          <Pressable
            className="pt-4 pr-2"
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={colorScheme === "dark" ? "#B6B6B6" : "#4A4A4A"}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default FormField;
