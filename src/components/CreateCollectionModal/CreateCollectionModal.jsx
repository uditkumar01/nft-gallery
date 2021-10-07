import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  InputLeftElement,
  Center,
  Heading,
  Stack,
  HStack,
  Badge,
  Avatar,
  Box,
  DarkMode,
  InputRightElement,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BiPlus, BiSearch } from "react-icons/bi";
import useAuth from "../../context/Auth/Auth";
import useUser from "../../context/User/User";
import { formatFullName, makeUsernameFromEmail } from "../../utils/formatName";
import { SearchInput, SideBarLink } from "..";
import { BsCollectionFill } from "react-icons/bs";
import { useNavigate } from "react-router";
import { firestore } from "../../Firebase";
import useCollections from "../../context/Collections/Collections";
import { cyrb53 } from "../../utils/encryptLabel";

function SearchResult({ label, images, _id, onClose }) {
  const navigate = useNavigate();
  console.log(_id, "search");
  return (
    <Button
      variant="unstyled"
      w="full"
      height="90px"
      borderColor="gray.800"
      onClick={() => {
        onClose();
        // redirecting to user profile
        navigate(`/collection/${_id}`);
        // window.location.href = `/account?user=${_id}`;
      }}
    >
      <HStack
        spacing={3}
        dir="row"
        border="none"
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="gray.600"
        bg="rgba(0,0,0,0)"
        boxShadow="2xl"
        p="0.7rem 1rem"
        _hover={{
          bg: "black.800",
          cursor: "pointer",
          borderColor: "black.800",
        }}
      >
        <Avatar borderRadius="md" name={`${label} collection`} />
        <Stack spacing={1} justify="flex-start">
          <Heading color="white" fontSize="1.1rem" textAlign="left" pl="0.2rem">
            {formatFullName(label || "")}
          </Heading>
          <Badge
            w="min-content"
            textAlign="left"
            color="gray.300"
            textTransform="none"
            fontWeight="semibold"
          >
            {images.length} nfts
          </Badge>
        </Stack>
      </HStack>
    </Button>
  );
}

export function CreateCollectionModal({ navBtn }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const { users } = useUser();
  const { authState } = useAuth();
  const { collections, collectionsDispatch } = useCollections();
  const [search, setSearch] = useState("");
  const addCollectionRef = useRef(null);
  const toast = useToast();

  async function createCollectionHandler(label) {
    if (label) {
      try {
        // checking if collection already exists

        const encodingLabelToHex = cyrb53(
          Buffer.from(label.toLowerCase().replace(/\s/g, "")).toString("hex")
        ).toString();

        const collectionExists = collections.some(
          (collection) => collection._id === encodingLabelToHex
        );

        if (collectionExists) {
          return toast({
            title: "Collection already exists",
            description: "Please try another name",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }

        console.log(encodingLabelToHex, "encodingLabelToHex");

        const collection = {
          label,
          images: [],
          owner: authState?.user?.uid || "",
        };
        // add collection to firestore
        await firestore()
          .collection("collections")
          .doc(encodingLabelToHex)
          .set(collection);

        collectionsDispatch({
          type: "ADD_COLLECTION",
          payload: {
            ...collection,
            _id: encodingLabelToHex,
          },
        });

        // onClose();
      } catch (err) {
        console.log("error creating collection", err);
      }
    }
  }

  const filteredUsersFromQuery =
    collections && search.length > 0
      ? collections.filter((collection) => {
          return collection?.label && collection?.label.includes(search);
        })
      : [];

  return (
    <DarkMode>
      {navBtn ? (
        <Box as="button" textAlign="left" onClick={onOpen}>
          <SideBarLink
            display={{ base: "block", lg: "none" }}
            icon={<BsCollectionFill fontSize="1rem" />}
            label="Collections"
          />
        </Box>
      ) : (
        <Box as="button" textAlign="left" onClick={onOpen}>
          <SearchInput />
        </Box>
      )}

      <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent
          bg="rgba(0,0,0,0.5)"
          boxShadow="0 2px 6px rgba(0,0,0,0.5), inset 0 1px rgba(255,255,255,0.3), inset 0 10px rgba(255,255,255,0.2), inset 0 10px 20px rgba(255,255,255,0.25), inset 0 -15px 30px rgba(0,0,0,0.3)"
        >
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              color="gray.300"
              fontSize="1.2em"
            >
              <BiSearch />
            </InputLeftElement>
            <Input
              placeholder="Type user's CredTag"
              borderColor="gray.600"
              color="white"
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <ModalBody p="1rem 0">
            {filteredUsersFromQuery.length < 1 ? (
              <Center p="2rem" color="whiteAlpha.600">
                <Stack align="center" justify="center" spacing={4}>
                  <Heading fontSize="4rem">
                    <BiSearch />
                  </Heading>
                  <Heading fontSize="2rem">&nbsp;&nbsp;Search Users</Heading>
                </Stack>
              </Center>
            ) : (
              filteredUsersFromQuery?.map((userItem) => {
                return (
                  <SearchResult
                    key={userItem.uid}
                    {...userItem}
                    onClose={onClose}
                  />
                );
              })
            )}
          </ModalBody>
          <ModalFooter>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                fontSize="1.2em"
              >
                <BsCollectionFill fontSize="1.15rem" />
              </InputLeftElement>
              <Input
                placeholder="Create new collection"
                borderColor="gray.600"
                color="white"
                ref={addCollectionRef}
              />
              <InputRightElement color="gray.300" fontSize="1.2em">
                <IconButton
                  onClick={() => {
                    console.log("add collection");
                    createCollectionHandler(
                      addCollectionRef?.current?.value || ""
                    );
                  }}
                >
                  <BiPlus fontSize="1.2rem" />
                </IconButton>
              </InputRightElement>
            </InputGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DarkMode>
  );
}
