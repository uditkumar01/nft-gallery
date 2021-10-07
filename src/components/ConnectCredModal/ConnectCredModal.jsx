import {
  Box,
  Button,
  chakra,
  DarkMode,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { RiQuestionnaireFill, FcGoogle } from "react-icons/all";

export function ConnectCredModal({
  children,
  btnStyles,
  isLoading,
  setBtnStatus,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = "rgba(36, 39, 54, 0.99)";
  return (
    <DarkMode>
      <Button
        onClick={onOpen}
        rounded="full"
        pos="relative"
        fontSize={["2xl", "2xl", "3xl", "3xl", "4xl", "4xl", "5xl"]}
        outlineColor="white"
        p={[
          "1.9rem 2.4rem",
          "1.9rem 2.4rem",
          "2.5rem 3rem",
          "2.5rem 3rem",
          "2.5rem 3rem",
          "2.5rem 3rem",
          "3rem 3.5rem",
        ]}
        {...btnStyles}
        bg="rgba(255, 255, 255, 1)"
        color="blackAlpha.700"
        transition="all 0.3s"
        _hover={{
          bg: "rgb(255, 255, 255, 0.8)",
          color: "black",
          transform: "translateY(-1px)",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
        isLoading={isLoading}
        leftIcon={<FcGoogle />}
      >
        {">"} &nbsp;
        {children}
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent bg={bg} rounded="md" overflow="hidden">
          {!false ? (
            <Progress value={50} size="xs" hasStripe isAnimated />
          ) : (
            <Progress colorScheme="blue" size="xs" isIndeterminate />
          )}
          <ModalHeader> </ModalHeader>
          <ModalBody>
            <Box p={4}>
              <Stack spacing={0}>
                <Stack spacing={4} textAlign="center">
                  <Heading fontSize="2rem" color="whiteAlpha.800">
                    <chakra.span>Hola</chakra.span>,{" "}
                    <chakra.span color="blue.300">User</chakra.span>
                  </Heading>
                  <Heading
                    fontSize="1.2srem"
                    fontWeight="semibold"
                    color="whiteAlpha.600"
                    pb="2rem"
                  >
                    Let&apos;s begin with a quick sign up
                  </Heading>
                </Stack>
                <FormControl isRequired>
                  <FormLabel htmlFor="credTag" color="whiteAlpha.800">
                    Email
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id="credTag"
                      color="whiteAlpha.900"
                      borderColor="gray.600"
                      placeholder={`email`}
                    />
                    <InputRightElement>
                      <Tooltip
                        label="Enter you email"
                        placement="auto"
                        hasArrow
                      >
                        <IconButton
                          variant="ghost"
                          aria-label="what-is-credTag"
                          icon={<RiQuestionnaireFill />}
                        />
                      </Tooltip>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText color="red.400" h="20px">
                    {/* {alreadyUsed &&
                      `${credTag} is already in use. Please try another one.`} */}
                  </FormHelperText>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="credTag" color="whiteAlpha.800">
                    Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id="credTag"
                      color="whiteAlpha.900"
                      borderColor="gray.600"
                      placeholder={`email`}
                    />
                    <InputRightElement>
                      <Tooltip
                        label="Enter you email"
                        placement="auto"
                        hasArrow
                      >
                        <IconButton
                          variant="ghost"
                          aria-label="what-is-credTag"
                          icon={<RiQuestionnaireFill />}
                        />
                      </Tooltip>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText color="red.400" h="20px">
                    {/* {alreadyUsed &&
                      `${credTag} is already in use. Please try another one.`} */}
                  </FormHelperText>
                </FormControl>
                <Stack spacing={4}>
                  <Button
                    bg="blue.400"
                    color="white"
                    mt="2rem"
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Create Wallet
                  </Button>
                  <Button color="whiteAlpha.700" onClick={onClose}>
                    Close
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </ModalBody>
          <ModalFooter> </ModalFooter>
        </ModalContent>
      </Modal>
    </DarkMode>
  );
}
