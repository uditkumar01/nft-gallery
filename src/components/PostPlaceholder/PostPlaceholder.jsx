import { Button, Flex, Text } from "@chakra-ui/react";
import { FaTelegramPlane } from "react-icons/fa";

export function PostPlaceholder() {
  return (
    <Flex
      bg="gray.700"
      color="gray.500"
      p="0.5rem 0.7rem 0.5rem 1.5rem"
      rounded="full"
      align="center"
      justify="space-between"
      mt="0.6rem"
      w="full"
      maxW="860px"
      cursor="pointer"
    >
      <Text>What's happening ?</Text>
      <Button
        rounded="full"
        fontWeight="400"
        color="white"
        colorScheme="messenger"
      >
        Post&nbsp;
        <FaTelegramPlane />
      </Button>
    </Flex>
  );
}
