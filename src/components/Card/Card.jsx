import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Image,
  Badge,
  chakra,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { CgFolderAdd } from "react-icons/cg";
import { HiOutlineThumbUp, HiThumbUp } from "react-icons/hi";
import { RiShareForwardLine } from "react-icons/ri";
import { CardFooterButton, CreateCollectionModal } from "..";
import useCollections from "../../context/Collections/Collections";
import { randomCoords } from "../../pages/Landing/Landing";
import { addCollectionItem } from "../../utils/firestore/addCollectionItem";
import { NftInfoModal } from "../NftInfoModal/NftInfoModal";

export const colors = ["##aca9f4", "#ace5a8", "#eddd9e", "#e0b1ab"];

export function Card({
  url,
  name,
  index,
  creator_address,
  userAddress,
  contract_address,
  disableAddToCollection,
  disableLike,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { collections, collectionsDispatch } = useCollections();
  const toast = useToast();

  const handleAddToCollection = async (collectionId) => {
    const res = await addCollectionItem(collectionId, url);
    if (res) {
      collectionsDispatch({
        type: "UPDATE_COLLECTION",
        payload: {
          collectionId,
          item: url,
        },
      });
      toast({
        title: "Added to collection",
        description: "Collection item added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "Collection item not added",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Center py={12}>
      <Flex
        flexDirection="column"
        role="group"
        align="center"
        pt={6}
        // maxW="330px"
        w="full"
        border="1px solid rgba(255, 255, 255, 0.125)"
        boxShadow="2xl"
        rounded="lg"
        pos="relative"
        zIndex={1}
      >
        <Box
          pos="absolute"
          top="0"
          left="0"
          w="100%"
          height="100%"
          background="radial-gradient(circle farthest-side, rgba(0,0,0,0.3), rgba(255,255,255, 0.08))"
          className="bg-blur"
          zIndex={-1}
          overflow="hidden"
        />
        <Box
          backgroundColor="gray.100"
          bg={colors[Math.floor(randomCoords(0, colors.length - 1))]}
          rounded="lg"
          mt={-12}
          pos="relative"
          height="230px"
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            background: imageLoaded ? "gray.700" : "transparent",
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
          overflow="hidden"
          mx={6}
        >
          <Box
            pos="absolute"
            top="0"
            left="0"
            w="100%"
            height="100%"
            background="radial-gradient(circle farthest-side, rgba(0,0,0,0.02), rgba(255,255,255, 0.15))"
            className="bg-blur"
            zIndex={-1}
            overflow="hidden"
          />
          <Box
            pos={imageLoaded ? "absolute" : "relative"}
            height={230}
            width={282}
            zIndex="-1"
            className="loading-boxes"
          />
          <Image
            pos={imageLoaded ? "relative" : "absolute"}
            rounded="lg"
            height={230}
            width={282}
            objectFit="cover"
            src={url}
            onLoad={() => {
              setImageLoaded(true);
            }}
          />
        </Box>

        <Stack pt={10} align="center">
          <Text
            color="gray.500"
            fontSize="sm"
            fontWeight="medium"
            textTransform="uppercase"
            as={Badge}
            rounded="full"
            px="2"
            overflow="hidden"
            pos="relative"
            bg="transparent"
          >
            <Box
              pos="absolute"
              top="0"
              left="0"
              w="100%"
              height="100%"
              background="rgba(0,0,0,0.4)"
              className="bg-blur"
              zIndex={0}
              overflow="hidden"
            />
            <Text pos="relative" zIndex={1} color="whiteAlpha.600">
              #{index}
            </Text>
          </Text>
          <Heading
            fontSize="2xl"
            color="gray.50"
            fontFamily="body"
            fontWeight={500}
          >
            {name}
          </Heading>
        </Stack>
        <Flex mt="6" w="full">
          {!disableLike && (
            <CardFooterButton
              callback={() => {}}
              icon={
                true ? (
                  <HiThumbUp color="#ffffff" fontSize="1.15rem" />
                ) : (
                  <HiOutlineThumbUp color="#ffffff" fontSize="1.15rem" />
                )
              }
            />
          )}
          {!disableAddToCollection && (
            <CreateCollectionModal
              callback={handleAddToCollection}
              icon={(collectionId) => {
                if (
                  collections
                    .find((item) => item._id === collectionId)
                    ?.items?.includes(url)
                ) {
                  return;
                }
                return <CgFolderAdd color="#ffffff" fontSize="1.15rem" />;
              }}
              footerBtn
            />
          )}
          <NftInfoModal
            name={name}
            creator_address={creator_address}
            userAddress={userAddress}
            contract_address={contract_address}
            token_id={index}
            url={url}
            footerBtn
          />
          <CardFooterButton
            callback={() => {}}
            btnProps={{
              borderRight: "1px solid",
              borderColor: "rgba(255, 255, 255, 0.06)",
            }}
            icon={<Image src="/svgs/opensea.svg" alt="opensea-logo" w="20px" />}
          />
          <CardFooterButton
            callback={() => {}}
            icon={<RiShareForwardLine color="#ffffff" fontSize="1.15rem" />}
          />
        </Flex>
      </Flex>
    </Center>
  );
}
