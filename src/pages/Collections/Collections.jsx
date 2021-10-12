import { Box, Flex, Heading, Stack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  MobileMenuButton,
  NavBreadCrumb,
  PostingAreaShell,
  ProfileSideBar,
  ScrollArea,
  SearchModal,
} from "../../components";
import { CollectionCard } from "../../components/CollectionCard/CollectionCard";
import useAuth from "../../context/Auth/Auth";
import useCollections from "../../context/Collections/Collections";
import { firestore } from "../../Firebase";
import { getUserFromUsername } from "../../utils/firestore/getUserFromUsername";
import { useMobileMenuState } from "../../hooks/useMobileMenuState";
import { getUserCollections } from "../../utils/firestore/getUserCollections";
import { formatFullName } from "../../utils/formatName";
import { Button } from "@chakra-ui/button";

export function Collections() {
  const { isOpen, toggle } = useMobileMenuState();
  const { authState, authDispatch, showLoadingScreen } = useAuth();
  const { collections } = useCollections();
  const toast = useToast();
  const { username } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [userCollection, setUserCollection] = useState([]);
  const navigate = useNavigate();

  async function pinCollectionHandler(collectionId) {
    console.log("pinCollectionHandler", collectionId);
    if (authState?.user?.pinnedCollection === collectionId) {
      return toast({
        title: "Collection already pinned",
        description: "Please choose another collection",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      try {
        await firestore().collection("users").doc(authState?.user?.uid).update({
          pinnedCollection: collectionId,
        });
        authDispatch({
          type: "SET_USER",
          payload: {
            ...(authState?.user || {}),
            pinnedCollection: collectionId,
          },
        });
        toast({
          title: "Collection pinned",
          description: "Collection pinned successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.log("error while pinning collection", error);
      }
    }
  }

  useEffect(() => {
    if (username && username !== authState?.user?.username) {
      (async () => {
        // gettin the user from the database
        const userDoc = await getUserFromUsername(username);

        if (userDoc?.uid) {
          const userUid = userDoc?.uid;
          // getting the collections of the user
          const userCollections = await getUserCollections(userUid);

          setUserCollection(userCollections);
          setUserDetails(userDoc);
        } else {
          console.log("user not found");
          toast({
            title: "User not found",
            description: "Please check the username",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return navigate("/");
        }
      })();
    }
  }, [authState?.user?.username, navigate, toast, username]);

  const visibleCollection =
    authState?.user?.username === username ? collections : userCollection;

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
                {`${formatFullName(userDetails?.displayName || "")}`}'s
                Collections
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
              {visibleCollection.length ? (
                visibleCollection?.map(({ _id, label, items }, index) => {
                  return (
                    <CollectionCard
                      key={`nft-collections-${index}- ${label}`}
                      collectionId={_id}
                      images={items}
                      label={label}
                      pinnedCollectionHandler={pinCollectionHandler}
                    />
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
                    Have no collections yet
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
