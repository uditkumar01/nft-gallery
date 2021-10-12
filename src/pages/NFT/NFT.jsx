import { Flex, Box, Stack, Heading, Button } from "@chakra-ui/react";
import {
  ProfileSideBar,
  PostingAreaShell,
  NavBreadCrumb,
  MobileMenuButton,
  ScrollArea,
  SearchModal,
  Card,
} from "../../components";
import { useMobileMenuState } from "../../hooks/useMobileMenuState";
import useAuth from "../../context/Auth/Auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useNFTs from "../../context/NFTs/NFTs";
import { getUserFromUsername } from "../../utils/firestore/getUserFromUsername";
import { formatFullName } from "../../utils/formatName";
import { getNftsFromAccountAddress } from "../../api/getNFTS";

export default function NFT() {
  const { isOpen, toggle } = useMobileMenuState();
  const { authState, showLoadingScreen } = useAuth();
  const { nfts, nftsDispatch } = useNFTs();
  const [user, setUser] = useState(null);
  // getting url query param
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // getting user data from user id from firestore
    (async () => {
      if (username) {
        // finding user in users using uid
        const user = await getUserFromUsername(username);
        setUser(user);
        let totalNfts = [];
        for (const ethAddress of user?.ethAddresses || []) {
          const { nfts } = await getNftsFromAccountAddress(ethAddress);
          totalNfts.push(...nfts);
        }
        nftsDispatch({
          type: "SET_NFTS",
          payload: {
            chain: "ethereum",
            nfts: totalNfts,
          },
        });
      }
    })();
  }, [username]);

  useEffect(() => {
    // getting user nfts
  }, [user]);

  console.log(nfts, user);

  const totalNFTCount = Object.values(nfts).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

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
          {!showLoadingScreen && authState?.isLoggedIn && (
            <Flex align="center" minH="8" mx="2">
              <MobileMenuButton onClick={toggle} isOpen={isOpen} />
            </Flex>
          )}

          <Flex flex="1" align="center" minH="8">
            {!showLoadingScreen && authState?.isLoggedIn ? (
              <NavBreadCrumb
                crumbs={[
                  { name: "Home", href: "/home" },
                  { name: "Account", href: "/account" },
                ]}
              />
            ) : (
              <Heading
                fontSize="3xl"
                fontWeight="semibold"
                color="whiteAlpha.800"
                py="1rem"
              >
                {`${formatFullName(user?.displayName || "")}`}'s NFTs
              </Heading>
            )}
          </Flex>

          {!showLoadingScreen && authState?.isLoggedIn ? (
            <SearchModal />
          ) : (
            <Button
              bg="rgba(255,255,255,0.4)"
              boxShadow="0 2px 6px rgba(0,0,0,0.2), inset 0 1px rgba(255,255,255,0.3), inset 0 10px rgba(255,255,255,0.2), inset 0 10px 20px rgba(255,255,255,0.25), inset 0 -15px 30px rgba(0,0,0,0.3)"
              transition="all 0.2s"
              _hover={{
                bg: "rgba(255,255,255,0.6)",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,0.2), inset 0 1px rgba(0,0,0,0.3), inset 0 10px rgba(0,0,0,0.2), inset 0 10px 20px rgba(0,0,0,0.25), inset 0 -15px 30px rgba(0,0,0,0.3)",
              }}
              onClick={() => navigate("/")}
            >
              Sign In
            </Button>
          )}
        </Flex>
        <Flex flex="1" overflow="auto" px={{ base: "3", lg: "3" }}>
          <Stack
            flex="1"
            mt="1rem"
            d="block"
            maxW={
              !showLoadingScreen && !authState?.isLoggedIn ? "full" : "1000px"
            }
            align="center"
          >
            <Box
              columns={3}
              d="grid"
              gridTemplateColumns="repeat( auto-fit, minmax(322px, 1fr))"
              gridGap={{
                base: "0.2rem",
                sm: "0.4rem",
                md: "0.6rem",
                lg: "0.8rem",
                xl: "1rem",
              }}
              placeContent="center"
            >
              {nfts && totalNFTCount ? (
                Object.values(nfts)?.map((chainNfts, i) => {
                  return chainNfts?.map(
                    ({ asset_url, name, token_id, ...rest }, j) => {
                      return (
                        <Card
                          key={`nft-${i}=${j}-${token_id}- ${name}`}
                          url={asset_url}
                          name={name}
                          index={token_id}
                          userAddress={user?.ethAddresses[0]}
                          {...rest}
                          disableAddToCollection
                          disableLike
                        />
                      );
                    }
                  );
                })
              ) : (
                <Stack
                  pos="relative"
                  zIndex="1"
                  flexDir="column"
                  align="center"
                  justify="center"
                  textAlign="center"
                  spacing={[4, 4, 6, 8, 12]}
                  p={{ base: "2rem 0rem", md: "4rem 0rem" }}
                  rounded="2xl"
                  w="full"
                  maxW="1000px"
                  m="auto"
                  overflow="hidden"
                  bg="rgba(0,0,0,0.3)"
                  boxShadow="0 2px 6px rgba(0,0,0,0.3), inset 0 1px rgba(255,255,255,0.2), inset 0 10px rgba(255,255,255,0.1), inset 0 10px 20px rgba(255,255,255,0.3), inset 0 -15px 30px rgba(0,0,0,0.3)"
                >
                  <Heading
                    className="ml10"
                    textAlign="center"
                    color="whiteAlpha.900"
                    fontSize={{ base: "xl", md: "3xl" }}
                  >
                    {user?.ethAddresses
                      ? "No NFTs found"
                      : "Wallet not connected"}
                  </Heading>
                </Stack>
              )}
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
            d={
              !showLoadingScreen && !authState?.isLoggedIn
                ? "none"
                : { base: "none", xl: "flex" }
            }
            pt="2rem"
          >
            <ScrollArea w="full" pt="5" pb="6">
              <ProfileSideBar user={authState?.user} />
            </ScrollArea>
          </Flex>
        </Flex>
      </PostingAreaShell>
    </Box>
  );
}
