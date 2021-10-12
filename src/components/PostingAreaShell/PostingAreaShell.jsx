import { Box, Flex, Stack } from "@chakra-ui/react";
import {
  BsCollectionFill,
  BsFillHouseFill,
  BsPersonFill,
} from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { ConnectWalletModal, SearchModal, UserInfo } from "..";
import { ScrollArea } from "../ScrollArea/ScrollArea";
import { SideBarLink } from "../SideBarLink/SideBarLink";
import useAuth from "../../context/Auth/Auth";
import { formatFullName } from "../../utils/formatName";
import { useNavigate } from "react-router";

export function PostingAreaShell({ children, isOpen }) {
  const { authState, showLoadingScreen, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <Flex
      height="100vh"
      bg="transparent"
      overflow="hidden"
      sx={{
        "--sidebar-width":
          !showLoadingScreen && authState?.isLoggedIn ? "16rem" : "0",
      }}
    >
      {!showLoadingScreen && authState?.isLoggedIn && (
        <Box
          as="nav"
          display="block"
          flex="1"
          width="var(--sidebar-width)"
          className={`sidebar-${isOpen ? "open" : "closed"}`}
          py="5"
          px="3"
          color="gray.200"
          h="100vh"
          zIndex="4"
          position="fixed"
        >
          <Box fontSize="sm" lineHeight="tall">
            <Box
              as="a"
              href="#"
              p="3"
              display="block"
              transition="background 0.1s"
              rounded="xl"
              _hover={{ bg: "whiteAlpha.200" }}
              whiteSpace="nowrap"
            >
              <UserInfo
                name={formatFullName(authState?.user?.displayName || "")}
                email={`@${authState?.user?.username || ""}`}
                image={authState?.user?.photoURL}
              />
            </Box>
            <ScrollArea pt="5" pb="6">
              <Stack spacing={1}>
                <SearchModal navBtn />

                <Box
                  as="button"
                  textAlign="left"
                  onClick={() => navigate("/home")}
                >
                  <SideBarLink
                    display={{ base: "block", lg: "none" }}
                    icon={<BsFillHouseFill />}
                    label="Home"
                  />
                </Box>
                <Box
                  as="button"
                  textAlign="left"
                  onClick={() => navigate("/collections")}
                >
                  <SideBarLink
                    display={{ base: "block", lg: "none" }}
                    icon={<BsCollectionFill fontSize="1rem" />}
                    label="Collections"
                  />
                </Box>

                <Box
                  as="button"
                  textAlign="left"
                  onClick={() => navigate("/account")}
                >
                  <SideBarLink
                    display={{ base: "block", lg: "none" }}
                    icon={<BsPersonFill />}
                    label="Profile"
                  />
                </Box>
                <ConnectWalletModal navBtn />
                <Box as="button" textAlign="left" onClick={() => signOut()}>
                  <SideBarLink
                    display={{ base: "block", lg: "none" }}
                    icon={<HiOutlineLogout fontSize="1.2rem" />}
                    label="Logout"
                  />
                </Box>
              </Stack>
            </ScrollArea>
          </Box>
        </Box>
      )}
      <Box
        flex="1"
        marginStart={{ md: "var(--sidebar-width)" }}
        position="relative"
        left={isOpen ? "var(--sidebar-width)" : "0"}
        transition="left 0.2s"
      >
        <Flex
          flexDir="column"
          maxW="2560px"
          bg="black.900"
          height="100%"
          pb="6"
          align={!showLoadingScreen && !authState?.isLoggedIn && "center"}
          overflow="auto"
        >
          {!showLoadingScreen && authState?.isLoggedIn ? (
            children
          ) : (
            <Flex w="100%" flexDir="column" maxW="1400px">
              {children}
            </Flex>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}
