import { Box, Divider, Flex, Stack } from "@chakra-ui/layout";
import {
  Card,
  CreatePostModal,
  MobileMenuButton,
  NavBreadCrumb,
  PostingAreaShell,
  ProfileSideBar,
  ScrollArea,
  SearchModal,
  SinglePost,
} from "../../components";
import useAuth from "../../context/Auth/Auth";
import useNFTs from "../../context/NFTs/NFTs";
import { useMobileMenuState } from "../../hooks/useMobileMenuState";

export function Collection() {
  const { isOpen, toggle } = useMobileMenuState();
  const { authState } = useAuth();
  const { nfts } = useNFTs();
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
              {Object.values(nfts)?.map((chainNfts, i) => {
                return chainNfts?.map(({ asset_url, name, token_id }, j) => {
                  return (
                    <Card
                      key={`nft-collection-item-${i}-${token_id}- ${name}`}
                      url={asset_url}
                      name={name}
                      index={token_id}
                    />
                  );
                });
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
              <ProfileSideBar user={authState?.user} />
            </ScrollArea>
          </Flex>
        </Flex>
      </PostingAreaShell>
    </Box>
  );
}
