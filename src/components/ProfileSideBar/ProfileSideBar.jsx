import {
  Avatar,
  Box,
  Button,
  useToast,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiEdit, FiUserPlus } from "react-icons/fi";
import Stories from "react-insta-stories";
import useAuth from "../../context/Auth/Auth";
import useCollections from "../../context/Collections/Collections";
import usePost from "../../context/Post/Post";
import useUser from "../../context/User/User";
import { firestore } from "../../Firebase";
import { formatFullName, makeUsernameFromEmail } from "../../utils/formatName";
import { removeDuplicates } from "../../utils/removeDuplicates";

export function ProfileSideBar({ user }) {
  const { authState, authDispatch } = useAuth();
  const { posts } = usePost();
  const { setTrigger } = useUser();
  const { collections } = useCollections();
  const userPosts = posts.filter((post) => post?.user?.uid === user?.uid);
  const [follow, setFollow] = useState(false);
  const toast = useToast();
  const [collectionImages, setCollectionImages] = useState([
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2ViJTIwd2FsbHBhcGVyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2ViJTIwd2FsbHBhcGVyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1622737133809-d95047b9e673?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8d2ViJTIwd2FsbHBhcGVyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://i2.wp.com/www.smartprix.com/bytes/wp-content/uploads/2018/02/Webp.net-resizeimage-4.jpg?ssl=1",
  ]);

  useEffect(() => {
    const alreadyFollowed = authState?.user?.following?.includes(user?.uid);
    setFollow(alreadyFollowed);
  }, [authState, user?.uid]);

  useEffect(() => {
    async function getUserCollection() {
      console.log("getUserCollection", user);
      if (user?.pinnedCollection) {
        const userCollection = await firestore()
          .collection("collections")
          .doc(user?.pinnedCollection)
          .get();
        if (userCollection?.exists) {
          const collectionItem = userCollection.data();
          const collectionImages = collectionItem?.items;
          collectionItem && setCollectionImages(collectionImages);
        }
      }
    }
    getUserCollection();
  }, [user]);

  async function followHandler() {
    try {
      if (follow) {
        await firestore()
          .collection("users")
          .doc(user.uid)
          .update({
            followers: user?.followers?.filter(
              (follower) => follower !== authState?.user?.uid
            ),
          });

        // updating current user following list

        await firestore()
          .collection("users")
          .doc(authState?.user?.uid)
          .update({
            following: authState?.user?.following?.filter(
              (following) => following !== user?.uid
            ),
          });

        authDispatch({
          type: "SET_USER",
          payload: {
            ...(authState?.user || {}),
            following: authState?.user?.following?.filter(
              (following) => following !== user?.uid
            ),
          },
        });

        setFollow(false);

        // toast unfollow success
        toast({
          title: "Unfollow Success",
          description: "You have unfollowed this user",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.log("following", user?.followers);
        // if (!user?.followers?.includes(authState?.user?.uid)) {
        await firestore()
          .collection("users")
          .doc(user.uid)
          .update({
            followers: removeDuplicates([
              ...(user?.followers || []),
              authState?.user?.uid,
            ]),
          });
        // }

        // updating current user following list
        if (!authState?.user?.following?.includes(user?.uid)) {
          await firestore()
            .collection("users")
            .doc(authState?.user?.uid)
            .update({
              following: [...(authState?.user?.following || []), user?.uid],
            });
        }

        authDispatch({
          type: "SET_USER",
          payload: {
            ...(authState?.user || {}),
            following: [...(authState?.user?.following || []), user?.uid],
          },
        });

        setFollow(true);

        // toast success
        toast({
          title: "Followed!",
          description: "You are now following this user",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      setTrigger((prev) => !prev);
    } catch (error) {
      console.log(error);
      // toast error
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }
  return (
    <Stack w="full">
      <Flex
        bgImage="https://i1.wp.com/digital-photography-school.com/wp-content/uploads/2014/05/4-113.jpg?ssl=1"
        bgPosition="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        width="full"
        height="200px"
        pos="relative"
        align="flex-end"
        justify="flex-end"
        rounded="md"
      >
        <Box pos="absolute" rounded="md" overflow="hidden">
          <Stories
            stories={collectionImages}
            defaultInterval={5000}
            width={450}
            height={200}
            loop={true}
          />
        </Box>
        <Box pos="absolute" bottom="-3rem" left="0.3rem">
          <Avatar
            borderColor="rgba(255, 255, 255, 0.7)"
            borderWidth="4px"
            showBorder
            w="80px"
            h="80px"
            loading="lazy"
            src={user?.photoURL}
            name={formatFullName(`${user?.displayName}` || "")}
          />
        </Box>
        {authState?.user?.uid === user?.uid ? (
          <Button
            size="sm"
            variant="outline"
            color="rgba(255, 255, 255, 1)"
            borderWidth="1px"
            borderColor="rgba(255, 255, 255, 0.125)"
            fontWeight="semibold"
            rounded="full"
            transition="all 0.5s"
            _hover={{ color: "rgba(255, 255, 255, 0.6)" }}
            pos="relative"
            bottom="-2.5rem"
            right="0.2rem"
            boxShadow="2xl"
          >
            <Box
              pos="absolute"
              top="0"
              left="0"
              w="100%"
              height="100%"
              background="radial-gradient(circle farthest-side, rgba(0,0,0,0.3), rgba(255,255,255, 0.08))"
              className="bg-blur"
              zIndex={0}
              overflow="hidden"
            />
            <Flex pos="relative" zIndex={1}>
              <FiEdit />
              &nbsp;&nbsp; Edit profile
            </Flex>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            color="rgba(255, 255, 255, 1)"
            borderWidth="1px"
            borderColor="rgba(255, 255, 255, 0.125)"
            fontWeight="semibold"
            rounded="full"
            transition="all 0.5s"
            _hover={{ color: "rgba(255, 255, 255, 0.6)" }}
            pos="relative"
            bottom="-2.5rem"
            right="0.2rem"
            boxShadow="2xl"
            onClick={followHandler}
          >
            <Box
              pos="absolute"
              top="0"
              left="0"
              w="100%"
              height="100%"
              background="radial-gradient(circle farthest-side, rgba(0,0,0,0.3), rgba(255,255,255, 0.08))"
              className="bg-blur"
              zIndex={0}
              overflow="hidden"
            />
            <Flex pos="relative" zIndex={1}>
              <FiUserPlus />
              &nbsp;&nbsp; {!follow ? "Follow" : "Unfollow"}
            </Flex>
          </Button>
        )}
      </Flex>
      <Stack spacing={0} color="gray.50" pt="3rem" pl="0.5rem">
        <Text fontSize="md" fontWeight="600" pb={1}>
          {formatFullName(user?.displayName || "")}
        </Text>
        <Text
          fontSize="0.8rem"
          fontWeight="400"
          color="gray.600"
          textTransform="none"
          as={Badge}
          rounded="full"
          px="2"
          overflow="hidden"
          pos="relative"
          bg="transparent"
          w="fit-content"
          border="1px solid rgba(255, 255, 255, 0.2)"
        >
          <Box
            pos="absolute"
            top="0"
            left="0"
            w="100%"
            height="100%"
            background="rgba(255,255,255,0.35)"
            className="bg-blur"
            zIndex={-1}
            overflow="hidden"
          />
          @{user?.username || ""}
        </Text>
      </Stack>
      <SimpleGrid columns={2} gridGap={4} p="1rem" color="gray.400">
        {[
          { count: userPosts.length, label: "posts" },
          { count: user?.followers.length, label: "followers" },
          { count: user?.following.length, label: "following" },
          { count: 100, label: "points" },
        ].map(({ count, label }) => {
          return (
            <Flex
              key={label}
              bg="transparent"
              align="center"
              justify="center"
              flexDir="column"
              rounded="md"
              h="80px"
              pos="relative"
              border="1px solid rgba(255, 255, 255, 0.125)"
              boxShadow="2xl"
            >
              <Box
                pos="absolute"
                top="0"
                left="0"
                w="100%"
                height="100%"
                background="radial-gradient(circle farthest-side, rgba(0,0,0,0.24), rgba(255,255,255, 0.08))"
                className="bg-blur"
                zIndex={-1}
                overflow="hidden"
              />
              <Text color="gray.50" fontSize="1.8rem" fontWeight="500">
                {count}
              </Text>
              <Text
                color="gray.400"
                textTransform="uppercase"
                fontSize="0.7rem"
                fontWeight="500"
              >
                {label}
              </Text>
            </Flex>
          );
        })}
      </SimpleGrid>
      {/* <Stack spacing={1}>
        <Divider borderColor="gray.600" />
        <SimpleGrid columns={4} gridGap={5} p="1.3rem">
          {
            // achievement array
            [
              "cred login done",
              "used 100 credits",
              "liked 10 posts",
              "cred login done",
              "used 100 credits",
              "liked 10 posts",
            ].map((achievement, index) => {
              return (
                <Box
                  key={`${achievement}-${index}`}
                  border="2px dashed"
                  borderColor="teal"
                  w="min-content"
                  rounded="full"
                >
                  <Avatar
                    borderColor="gray.900"
                    size="lg"
                    name={achievement}
                    showBorder
                  />
                </Box>
              );
            })
          }
        </SimpleGrid>
      </Stack> */}
    </Stack>
  );
}
