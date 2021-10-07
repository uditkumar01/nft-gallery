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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import useAuth from "../../context/Auth/Auth";
import useUser from "../../context/User/User";
import { formatFullName, makeUsernameFromEmail } from "../../utils/formatName";
import { SearchInput, SideBarLink } from "..";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router";

function SearchResult({ photoURL, displayName, email, uid, onClose }) {
  const navigate = useNavigate();
  console.log(uid, "search");
  return (
    <Button
      variant="unstyled"
      w="full"
      height="90px"
      borderColor="red"
      onClick={() => {
        onClose();
        // redirecting to user profile
        navigate(`/account?user=${uid}`);
        // window.location.href = `/account?user=${uid}`;
      }}
    >
      <HStack
        spacing={3}
        dir="row"
        border="none"
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="gray.600"
        p="0.7rem 1rem"
        _hover={{
          bg: "black.800",
          cursor: "pointer",
          borderColor: "black.800",
        }}
      >
        <Avatar
          borderRadius="md"
          name={displayName?.charAt(0) || ""}
          src={photoURL || ""}
        />
        <Stack spacing={1} justify="flex-start">
          <Heading color="white" fontSize="1.1rem" textAlign="left" pl="0.2rem">
            {formatFullName(displayName || "")}
          </Heading>
          <Badge
            w="min-content"
            textAlign="left"
            color="gray.300"
            textTransform="none"
            fontWeight="semibold"
          >
            @{makeUsernameFromEmail(email)}
          </Badge>
        </Stack>
      </HStack>
    </Button>
  );
}

export function SearchModal({ navBtn }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const { users } = useUser();
  const { authState } = useAuth();
  const [search, setSearch] = useState("");

  const filteredUsersFromQuery =
    users && search.length > 0
      ? users.filter((user) => {
          return (
            user?.uid !== authState?.user?.uid &&
            (user?.displayName?.includes(search) ||
              user?.email?.includes(search))
          );
        })
      : [];

  return (
    <DarkMode>
      {navBtn ? (
        <Box as="button" textAlign="left" onClick={onOpen}>
          <SideBarLink
            display={{ base: "block", lg: "none" }}
            icon={<BsSearch fontSize="1rem" />}
            label="Search"
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
              placeholder="Search for user"
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
          <ModalFooter> </ModalFooter>
        </ModalContent>
      </Modal>
    </DarkMode>
  );
}
