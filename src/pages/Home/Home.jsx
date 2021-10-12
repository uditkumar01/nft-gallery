import { Box, Flex, Stack, Divider } from "@chakra-ui/react";
import { useMobileMenuState } from "../../hooks/useMobileMenuState";
import {
  CreatePostModal,
  MobileMenuButton,
  NavBreadCrumb,
  ProfileSideBar,
  ScrollArea,
  SearchModal,
} from "../../components";
import { PostingAreaShell, SinglePost } from "../../components";
import useAuth from "../../context/Auth/Auth";
import { useEffect } from "react";
import usePost from "../../context/Post/Post";
import { useNavigate } from "react-router";

export default function Home() {
  const { isOpen, toggle } = useMobileMenuState();
  const { posts } = usePost();
  const { authState, showLoadingScreen } = useAuth();
  const postsLen = posts.length;
  const navigate = useNavigate();

  useEffect(() => {
    if (!showLoadingScreen && !authState?.isLoggedIn) {
      navigate("/");
    }
  }, [authState, navigate, showLoadingScreen]);
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
            <NavBreadCrumb crumbs={[{ name: "Home", href: "/" }]} />
          </Flex>

          <SearchModal />
        </Flex>
        <Flex flex="1" overflow="auto" px={{ base: "3", lg: "10" }}>
          <Stack flex="1" mt="2rem" maxW="1000px" align="center">
            <CreatePostModal />
            <Stack p="2rem 0" spacing={0} w="full" maxW="800px">
              {posts.map((post, index) => {
                return (
                  <Box key={`single-post-${index}`}>
                    <SinglePost {...post} />
                    {index !== postsLen - 1 && (
                      <Divider
                        borderColor="rgba(255, 255, 255, 0.125)"
                        my={3}
                      />
                    )}
                  </Box>
                );
              })}
              {/* <Divider borderColor="gray.700" />
              <SinglePost /> */}
            </Stack>
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
