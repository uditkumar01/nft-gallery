import {
  Avatar,
  Button,
  Flex,
  Stack,
  Text,
  useToast,
  Box,
  Badge,
  chakra,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { HiOutlineThumbUp, HiThumbUp } from "react-icons/hi";
import { RiShareForwardLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import useAuth from "../../context/Auth/Auth";
import { auth, firestore } from "../../Firebase";
import { formatFullName, makeUsernameFromEmail } from "../../utils/formatName";
import { timeAgo } from "../../utils/timeAgo";
import { removeDuplicates } from "../../utils/removeDuplicates";
import { BiUserCheck, BiUserPlus } from "react-icons/bi";

export function SinglePost({ post, uid, createdAt, user, likes }) {
  const toast = useToast();
  const { authState, authDispatch } = useAuth();
  const alreadyLiked = likes.includes(authState?.user?.uid);
  const navigate = useNavigate();
  const [follow, setFollow] = useState(false);
  const [like, setLike] = useState(alreadyLiked);
  useEffect(() => {
    const alreadyFollowed = authState?.user?.following?.includes(user?.uid);
    setFollow(alreadyFollowed);
  }, [authState]);
  async function likeHandler() {
    try {
      if (like) {
        await firestore()
          .collection("posts")
          .doc(uid)
          .update({
            likes: likes.filter((like) => like !== authState?.user?.uid),
          });
        // toast unlike success

        setLike(false);

        toast({
          title: "Unlike Success",
          description: "You have unliked this post",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        await firestore()
          .collection("posts")
          .doc(uid)
          .update({
            likes: [...likes, authState?.user?.uid],
          });
        // toast success

        setLike(true);

        toast({
          title: "Liked!",
          description: "You liked this post",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
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
    <Flex
      flexDir="column"
      bg="transparent"
      rounded="md"
      border="1px solid rgba(255, 255, 255, 0.125)"
      boxShadow="2xl"
      overflow="hidden"
      pos="relative"
    >
      <Box
        pos="absolute"
        top="0"
        left="0"
        w="100%"
        height="100%"
        background="radial-gradient(circle farthest-side, rgba(0,0,0,0.2), rgba(255,255,255, 0.1))"
        className="bg-blur"
        zIndex={0}
        overflow="hidden"
      />
      <Flex
        p="1.3rem 1rem"
        flexDir={{ base: "column", sm: "row" }}
        pos="relative"
        zIndex={1}
      >
        <Flex>
          <Avatar
            onClick={() => navigate(`/account?user=${user.uid}`)}
            name={formatFullName(user?.displayName || "")}
            src={user?.photoURL}
          />
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={{ base: 0, lg: 4 }}
            mb={{ base: "1rem", lg: "0.3rem" }}
            justify="flex-start"
            color="gray.100"
            ml={{ base: "1rem", sm: "0" }}
            d={{ base: "flex", sm: "none" }}
          >
            <Text fontSize="md" fontWeight="400" color="white">
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
              h="20px"
            >
              <Box
                pos="absolute"
                top="0"
                left="0"
                w="100%"
                height="100%"
                background="rgba(255,255,255,0.4)"
                className="bg-blur"
                zIndex={0}
                overflow="hidden"
              />
              <Text pos="relative" zIndex={1} color="blackAlpha.700">
                @{makeUsernameFromEmail(user?.email || "")}
              </Text>
            </Text>
          </Stack>
        </Flex>
        <Flex color="gray.100" flexDir="column" p="0 0.7rem">
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={{ base: 0, lg: 4 }}
            mb={{ base: "1rem", lg: "0.3rem" }}
            justify="flex-start"
            color="gray.100"
            ml={{ base: "1rem", sm: "0" }}
            d={{ base: "none", sm: "flex" }}
          >
            <Text fontSize="md" fontWeight="400" color="white">
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
              h="20px"
            >
              <Box
                pos="absolute"
                top="0"
                left="0"
                w="100%"
                height="100%"
                background="rgba(255,255,255,0.4)"
                className="bg-blur"
                zIndex={0}
                overflow="hidden"
              />
              <Text d="block" pos="relative" zIndex={1} color="blackAlpha.700">
                @{makeUsernameFromEmail(user?.email || "")}
              </Text>
            </Text>
          </Stack>
          <Text fontSize="0.95rem" fontWeight="300" color="gray.100">
            {post}
          </Text>
        </Flex>
      </Flex>
      {user?.uid !== authState?.user?.uid && (
        <Flex>
          <Button
            flex={1}
            d="inline-flex"
            variant="unstyled"
            color="blue.400"
            rounded="none"
            borderRight="1px solid"
            borderColor="rgba(255, 255, 255, 0.06)"
            _hover={{ bg: "gray.700" }}
            onClick={likeHandler}
            pos="relative"
            overflow="hidden"
            className="post-btn"
            transition="all 0.2s"
          >
            <Box
              pos="absolute"
              top="0"
              left="0"
              w="100%"
              height="100%"
              background="linear-gradient(to top, rgba(0,0,0,0.15), rgba(255,255,255, 0)) 100%"
              className="bg-blur"
              zIndex={0}
              overflow="hidden"
              transition="all 0.2s"
            />

            <Text
              d="flex"
              fontSize="sm"
              color="gray.200"
              pos="relative"
              zIndex={1}
              align="center"
              justify="center"
            >
              {like ? (
                <HiThumbUp color="#ffffff" fontSize="1.15rem" />
              ) : (
                <HiOutlineThumbUp color="#ffffff" fontSize="1.15rem" />
              )}
              <chakra.span d={{ base: "none", sm: "flex" }}>
                &nbsp;&nbsp; {likes ? likes.length : 0} likes
              </chakra.span>
            </Text>
          </Button>
          <Button
            flex={1}
            d="inline-flex"
            variant="unstyled"
            color="gray.400"
            rounded="none"
            borderRight="1px solid"
            borderColor="rgba(255, 255, 255, 0.06)"
            _hover={{ bg: "gray.700" }}
            onClick={followHandler}
            pos="relative"
            overflow="hidden"
            className="post-btn"
            transition="all 0.2s"
          >
            <Box
              pos="absolute"
              top="0"
              left="0"
              w="100%"
              height="100%"
              background="linear-gradient(to top, rgba(0,0,0,0.15), rgba(255,255,255, 0)) 100%"
              className="bg-blur"
              zIndex={0}
              overflow="hidden"
              transition="all 0.2s"
            />
            <Text
              d="flex"
              fontSize="sm"
              color="gray.200"
              pos="relative"
              zIndex={1}
              align="center"
              justify="center"
            >
              {follow ? (
                <BiUserCheck fontSize="1.5rem" color="#ffffff" />
              ) : (
                <BiUserPlus fontSize="1.5rem" color="#ffffff" />
              )}
              <chakra.span d={{ base: "none", sm: "flex" }}>
                &nbsp;&nbsp; {follow ? "followed" : "follow"}
              </chakra.span>
            </Text>
          </Button>
          <Button
            flex={1}
            d="inline-flex"
            variant="unstyled"
            color="gray.400"
            rounded="none"
            _hover={{ bg: "gray.700" }}
            pos="relative"
            overflow="hidden"
            className="post-btn"
            transition="all 0.2s"
          >
            <Box
              pos="absolute"
              top="0"
              left="0"
              w="100%"
              height="100%"
              background="linear-gradient(to top, rgba(0,0,0,0.15), rgba(255,255,255, 0)) 100%"
              className="bg-blur"
              zIndex={0}
              overflow="hidden"
              transition="all 0.2s"
            />

            <Text
              d="flex"
              fontSize="sm"
              color="gray.200"
              pos="relative"
              zIndex={1}
              align="center"
              justify="center"
            >
              <RiShareForwardLine color="#ffffff" fontSize="1.15rem" />
              <chakra.span d={{ base: "none", sm: "flex" }}>
                &nbsp;&nbsp; share
              </chakra.span>
            </Text>
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
