import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  Textarea,
  ModalBody,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  DarkMode,
  Flex,
  Text,
  HStack,
  chakra,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaTelegramPlane } from "react-icons/all";
import { EmojiPallet } from "..";
import useAuth from "../../context/Auth/Auth";
import usePost from "../../context/Post/Post";
import { firestore } from "../../Firebase";

export function CreatePostModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authState } = useAuth();
  const { postDispatch } = usePost();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  let [value, setValue] = useState("");
  const totalWordLimit = 150;

  const onEmojiClick = (event, emojiObject) => {
    // console.log(emojiObject);
    if (value.length + 1 <= totalWordLimit) {
      setValue((prev) => prev + emojiObject.emoji);
    }
  };

  let handleInputChange = (e) => {
    if (e.target.value.length <= totalWordLimit) {
      let inputValue = e.target.value;
      setValue(inputValue);
    }
  };

  const colors = ["green.500", "yellow.500", "red.500"];
  const colorIndex =
    value.length === 150 ? 2 : Math.floor(value.length / 50) % colors.length;

  async function handleSubmit() {
    // uploading post to firestore db
    try {
      setIsLoading(true);
      const createdAt = new Date().toISOString();
      const newPost = {
        likes: [],
        post: value,
        createdAt,
        user: firestore().doc(`users/${authState?.user?.uid}`),
      };
      await firestore().collection("posts").add(newPost);

      // postDispatch({
      //   type: "ADD_POST",
      //   payload: {
      //     ...newPost,
      //     user: {
      //       uid: authState?.user?.uid,
      //       displayName: authState?.user?.displayName,
      //       photoURL: authState?.user?.photoURL,
      //       email: authState?.user?.email,
      //     },
      //   },
      // });

      setValue("");
      onClose();
      // success toast
      toast({
        title: "Post Created",
        description: "Your post has been created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      // toast error
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  }

  console.log(isLoading);

  return (
    <DarkMode>
      <Flex
        as="button"
        bg="transparent"
        color="gray.400"
        p="0.5rem 0.7rem 0.5rem 1.5rem"
        rounded="full"
        align="center"
        justify="space-between"
        mt="0.6rem"
        w="full"
        minH="55px"
        maxW="860px"
        cursor="pointer"
        onClick={onOpen}
        pos="relative"
        border="1px solid rgba(255, 255, 255, 0.125)"
        boxShadow="2xl"
        overflow="hidden"
      >
        <Box
          pos="absolute"
          top="0"
          left="0"
          w="100%"
          height="100%"
          background="radial-gradient(circle farthest-side, rgba(0,0,0,0.2), rgba(255,255,255, 0.1))"
          className="bg-blur"
          zIndex={0}
          overflow="hidden"
        />
        <Text pos="relative" zIndex={1}>
          What's happening ?
        </Text>
        <Button
          pos="relative"
          zIndex={1}
          rounded="full"
          fontWeight="400"
          color="white"
          bg="blue.500"
          _hover={{ bg: "blue.600" }}
          colorScheme="messenger"
          isLoading={isLoading}
        >
          Post&nbsp;
          <FaTelegramPlane />
        </Button>
      </Flex>

      <Modal onClose={onClose} isOpen={isOpen} w="100%">
        <ModalOverlay />
        <ModalContent
          bg="rgba(0,0,0,0.5)"
          boxShadow="0 2px 6px rgba(0,0,0,0.5), inset 0 1px rgba(255,255,255,0.3), inset 0 10px rgba(255,255,255,0.2), inset 0 10px 20px rgba(255,255,255,0.25), inset 0 -15px 30px rgba(0,0,0,0.3)"
        >
          <ModalHeader>
            <Flex justify="space-between">
              <Button
                size="sm"
                rounded="full"
                color="whiteAlpha.800"
                minW="64px"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                size="sm"
                rounded="full"
                color="whiteAlpha.900"
                bg="blue.500"
                _hover={{ bg: "blue.600" }}
                colorScheme="twitter"
                minW="60px"
                onClick={handleSubmit}
                isLoading={isLoading}
                isDisabled={value.length < 1}
              >
                Post
              </Button>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Textarea
              color="gray.100"
              value={value}
              borderColor="gray.600"
              onChange={handleInputChange}
              placeholder="What's happening ?"
              size="sm"
              rows={5}
            />
          </ModalBody>
          <ModalFooter>
            <HStack>
              <EmojiPallet onEmojiClick={onEmojiClick} />
              <chakra.span
                bg={colors[colorIndex]}
                color="gray.100"
                h="31px"
                minW="31px"
                as={Flex}
                justify="center"
                align="center"
                rounded="full"
                p="0 0.5rem"
                fontSize="sm"
                fontWeight="400"
              >
                {totalWordLimit - value.length > 0
                  ? totalWordLimit - value.length
                  : 0}
              </chakra.span>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DarkMode>
  );
}
