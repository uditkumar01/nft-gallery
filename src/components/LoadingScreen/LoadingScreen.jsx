import { Center, Spinner } from "@chakra-ui/react";

export function LoadingScreen() {
  return (
    <Center bg="gray.900" w="100vw" h="100vh" pos="absolute" top="0" left="0">
      <Spinner colorScheme="twitter" color="cyan" size="lg" />
    </Center>
  );
}
