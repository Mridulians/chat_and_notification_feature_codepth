import React from "react";
import { Avatar, HStack, Text } from "@chakra-ui/react";

const Message = ({ text, url, user="other" }) => {
  return (
    <HStack
      alignSelf={user === "me" ? "flex-end" : "flex-start"}
      borderRadius={"base"}
      bg={"gray.100"}
      paddingY={"2"}
      paddingX={"4"}
    >


      {user === "other" && <Avatar src={url} />}
      <Text>{text}</Text>
      {user === "me" && <Avatar src={url} />}
    </HStack>
  );
};

export default Message;
