import { Image } from "@chakra-ui/image";
import {
  Box,
  SimpleGrid,
  Flex,
  Text,
  Stack,
  Heading,
  Center,
  Badge,
} from "@chakra-ui/layout";
import { useState } from "react";
import { AiOutlinePushpin } from "react-icons/ai";
import { CgFolderAdd } from "react-icons/cg";
import { HiOutlineThumbUp, HiThumbUp } from "react-icons/hi";
import { ImEye } from "react-icons/im";
import { RiEyeLine, RiShareForwardLine } from "react-icons/ri";
import { CardFooterButton, CreateCollectionModal } from "..";
import useAuth from "../../context/Auth/Auth";
import { randomCoords } from "../../pages/Landing/Landing";

const getSquareWholeNum = (num) => {
  return Math.floor(Math.sqrt(num));
};

const colors = ["##aca9f4", "#ace5a8", "#eddd9e", "#e0b1ab"];

const COLLECTION_CARD_DIMENSIONS = {
  height: 230,
  width: 282,
};

function CardShell({
  imageChild,
  label,
  count,
  pinnedCollectionHandler,
  collectionId,
  ...props
}) {
  const [imageLoaded, setImageLoaded] = useState(true);
  const { authState, showLoadingScreen } = useAuth();
  return (
    <Center py={12}>
      <Flex
        flexDirection="column"
        role="group"
        pt={6}
        maxW="600px"
        w="full"
        border="1px solid rgba(255, 255, 255, 0.125)"
        boxShadow="2xl"
        rounded="lg"
        pos="relative"
        align="center"
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
          h={COLLECTION_CARD_DIMENSIONS.height + 6}
          w={COLLECTION_CARD_DIMENSIONS.width}
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
            d={imageLoaded ? "none" : "block"}
            height={230}
            width={282}
            zIndex="-1"
            className="loading-boxes"
          />
          {imageChild ? (
            imageChild
          ) : (
            <Image
              pos={imageLoaded ? "relative" : "absolute"}
              rounded="lg"
              height={230}
              width={282}
              objectFit="cover"
              src={"https://source.unsplash.com/random"}
              onLoad={() => {
                setImageLoaded(true);
              }}
            />
          )}
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
              {count || 0} nfts
            </Text>
          </Text>
          <Heading
            fontSize="2xl"
            color="gray.50"
            fontFamily="body"
            fontWeight={500}
            textTransform="capitalize"
          >
            {label}
          </Heading>
        </Stack>
        <Flex mt="6" w="full">
          {!showLoadingScreen && authState?.isLoggedIn && (
            <>
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
              <CardFooterButton
                callback={() => {}}
                btnProps={{
                  borderRight: "1px solid",
                  borderLeft: "1px solid",
                  borderColor: "rgba(255, 255, 255, 0.06)",
                }}
                icon={<RiEyeLine color="#ffffff" fontSize="1.15rem" />}
              />
              <CardFooterButton
                callback={() => pinnedCollectionHandler(collectionId)}
                btnProps={{
                  borderRight: "1px solid",
                  borderColor: "rgba(255, 255, 255, 0.06)",
                }}
                isDisabled={count < 1}
                icon={<AiOutlinePushpin color="#ffffff" fontSize="1.15rem" />}
              />
              <CardFooterButton
                callback={() => {}}
                icon={<RiShareForwardLine color="#ffffff" fontSize="1.15rem" />}
              />
            </>
          )}
        </Flex>
      </Flex>
    </Center>
  );
}

export function CollectionCard({
  images,
  label,
  pinnedCollectionHandler,
  collectionId,
}) {
  let squareNum = getSquareWholeNum(images?.length || 0);
  squareNum = squareNum > 5 ? 5 : squareNum;
  const gridItemDimensions = {
    height: COLLECTION_CARD_DIMENSIONS.height / (squareNum > 0 ? squareNum : 1),
    width: COLLECTION_CARD_DIMENSIONS.width / (squareNum > 0 ? squareNum : 1),
  };

  const imageArray = squareNum
    ? images.slice(0, squareNum * squareNum)
    : [
        `https://source.unsplash.com/featured/?${label.replace(
          /[^a-zA-Z0-9_]/g,
          "+"
        )},pattern,NFT,art,generative_art`,
      ];

  return (
    <CardShell
      label={label + (label.length < 7 ? " collection" : "")}
      count={images?.length || 0}
      pinnedCollectionHandler={pinnedCollectionHandler}
      collectionId={collectionId}
      imageChild={
        <Box
          role="group"
          maxW="330px"
          w="full"
          border="1px solid rgba(255, 255, 255, 0.125)"
          boxShadow="2xl"
          rounded="lg"
          pos="relative"
          zIndex={1}
          overflow="hidden"
          height="full"
          width={COLLECTION_CARD_DIMENSIONS.width}
          minH={COLLECTION_CARD_DIMENSIONS.height}
          p="2px"
        >
          <SimpleGrid columns={squareNum} spacing={0} placeItems="center">
            {imageArray?.map((image, index) => {
              return (
                <Box key={`collections-item-${index}`} overflow="hidden">
                  <Image
                    height={gridItemDimensions.height}
                    width={gridItemDimensions.width}
                    src={image}
                    objectFit="cover"
                    borderRadius="lg"
                    alt={label}
                    p="2px"
                  />
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      }
    />
  );
}
