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
  Flex,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BiPlus, BiSearch } from "react-icons/bi";
import useAuth from "../../context/Auth/Auth";
import { formatFullName, makeUsernameFromEmail } from "../../utils/formatName";
import { CardFooterButton, SearchInput, SideBarLink } from "..";
import { BsCollectionFill } from "react-icons/bs";
import { useNavigate } from "react-router";
import { firestore } from "../../Firebase";
import useCollections from "../../context/Collections/Collections";
import { cyrb53 } from "../../utils/encryptLabel";
import { CgFolderAdd } from "react-icons/cg";

function SearchResult({ label, items, _id, onClose, icon, callback }) {
  const iconItem = icon && icon(_id);
  console.log(_id, "search");
  return (
    <Button
      variant="unstyled"
      w="full"
      height="90px"
      _active={{
        boxShadow: "none",
      }}
      _focus={{
        boxShadow: "none",
      }}
      borderColor="gray.800"
    >
      <Flex
        border="none"
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="gray.600"
        bg="rgba(0,0,0,0)"
        boxShadow="2xl"
        p="0.7rem 1rem"
        transition="all 0.2s"
        _hover={{
          bg: "rgba(0,0,0,0.3)",
          cursor: "pointer",
          borderColor: "black.800",
        }}
        justify="space-between"
      >
        <HStack spacing={3} dir="row">
          <Avatar borderRadius="md" name={`${label} collection`} />
          <Stack spacing={1} justify="flex-start">
            <Heading
              color="white"
              fontSize="1.1rem"
              textAlign="left"
              pl="0.2rem"
            >
              {formatFullName(label || "")}
            </Heading>
            <Badge
              w="min-content"
              textAlign="left"
              color="gray.300"
              textTransform="none"
              fontWeight="semibold"
            >
              {items?.length} nfts
            </Badge>
          </Stack>
        </HStack>
        {iconItem && (
          <IconButton onClick={() => callback(_id)}>{iconItem}</IconButton>
        )}
      </Flex>
    </Button>
  );
}

export function CreateCollectionModal({ navBtn, icon, callback, footerBtn }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const { authState } = useAuth();
  const { collections, collectionsDispatch } = useCollections();
  const [search, setSearch] = useState("");
  const addCollectionRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();

  console.log(collections, "collections");

  async function createCollectionHandler(label) {
    if (label) {
      try {
        // checking if collection already exists

        const encodingLabelToHex = cyrb53(
          Buffer.from(
            `${label.toLowerCase().replace(/\s/g, "")}${authState?.user?.email}`
          ).toString("hex")
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
          items: [],
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

        addCollectionRef.current.value = "";

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
      {navBtn && (
        <Box as="button" textAlign="left" onClick={onOpen}>
          <SideBarLink
            display={{ base: "block", lg: "none" }}
            icon={<BsCollectionFill fontSize="1rem" />}
            label="Collections"
          />
        </Box>
      )}
      {footerBtn && (
        <CardFooterButton
          btnProps={{
            borderRight: "1px solid",
            borderLeft: "1px solid",
            borderColor: "rgba(255, 255, 255, 0.06)",
          }}
          callback={onOpen}
          icon={<CgFolderAdd fontSize="1.25rem" color="#ffffff" />}
        />
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
                    icon={icon}
                    callback={callback}
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
