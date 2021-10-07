import { Flex, SimpleGrid, Box, Stack } from "@chakra-ui/react";
import {
  ProfileSideBar,
  PostingAreaShell,
  NavBreadCrumb,
  MobileMenuButton,
  ScrollArea,
  SearchModal,
  Card,
} from "../../components";
import "./Account.css";
import { useMobileMenuState } from "../../hooks/useMobileMenuState";
import useAuth from "../../context/Auth/Auth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { parse } from "query-string";
import useUser from "../../context/User/User";
import { getNftsFromAccountAddress } from "../../api/getNFTS";

export default function Account() {
  const { isOpen, toggle } = useMobileMenuState();
  const { authState, showLoadingScreen } = useAuth();
  const { users } = useUser();
  const [nfts, setNfts] = useState([]);
  const [user, setUser] = useState(null);
  // getting url query param
  const { search } = useLocation();
  const query = parse(search);

  useEffect(() => {
    if (!showLoadingScreen && !authState?.isLoggedIn) {
      window.location.href = "/";
    }
  }, [showLoadingScreen, authState]);

  const account = "0x4c8f93d95354ecf0b54222be4c4e8fb37ba8f3bc";

  useEffect(() => {
    // getting user data from user id from firestore
    (async () => {
      if (query.user) {
        // finding user in users using uid
        const user = users.find((user) => user.uid === query.user);
        setUser(user);
      } else {
        setUser(authState?.user);
      }
    })();
  }, [authState?.user, query.user, users]);

  useEffect(() => {
    // getting user nfts
    (async () => {
      if (user) {
        try {
          const res = await getNftsFromAccountAddress(account);
          if (res?.nfts) {
            setNfts(res.nfts);
          }
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [user]);

  console.log({ nfts });

  return (
    <Box bg="#171923" w="100vw" h="100vh" pos="relative">
      <Box
        bg="url(/images/bg.webp)"
        backgroundSize="contain"
        backgroundPosition="center"
        pos="absolute"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        filter="blur(100px)"
      />
      <PostingAreaShell isOpen={isOpen}>
        <Flex
          py="3"
          justify="space-between"
          align="center"
          px={{ base: "10", md: "4" }}
          mt={{ base: "0", md: "5" }}
        >
          <Flex align="center" minH="8" mx="2">
            <MobileMenuButton onClick={toggle} isOpen={isOpen} />
          </Flex>
          <Flex flex="1" align="center" minH="8">
            <NavBreadCrumb
              crumbs={[
                { name: "Home", href: "/home" },
                { name: "Account", href: "/account" },
              ]}
            />
          </Flex>

          <SearchModal />
        </Flex>
        <Flex flex="1" overflow="auto" px={{ base: "3", lg: "3" }}>
          <Stack flex="1" mt="1rem" d="block" maxW="1000px" align="center">
            <Box
              columns={3}
              d="grid"
              gridTemplateColumns="repeat( auto-fit, minmax(250px, 1fr))"
              gridGap={{
                base: "0.2rem",
                sm: "0.4rem",
                md: "0.6rem",
                lg: "0.8rem",
                xl: "1rem",
              }}
              placeContent="center"
            >
              {nfts?.map(({ asset_url, name, token_id }, i) => {
                return (
                  <Card
                    key={`nft-${i}`}
                    url={asset_url}
                    name={name}
                    index={token_id}
                  />
                );
              })}
            </Box>
          </Stack>
          <Flex
            flex="1"
            maxW="450px"
            w="full"
            ml="4rem"
            justifyContent="flex-end"
            pos="sticky"
            top="0"
            right="0"
            d={{ base: "none", xl: "flex" }}
            pt="2rem"
          >
            <ScrollArea w="full" pt="5" pb="6">
              <ProfileSideBar user={user} />
            </ScrollArea>
          </Flex>
        </Flex>
      </PostingAreaShell>
    </Box>
  );
}
