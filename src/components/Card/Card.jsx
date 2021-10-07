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
} from "@chakra-ui/react";
import { useState } from "react";
import { CgFolderAdd } from "react-icons/cg";
import { HiOutlineThumbUp, HiThumbUp } from "react-icons/hi";
import { RiShareForwardLine } from "react-icons/ri";
import { CardFooterButton } from "..";

export function Card({ url, name, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Center py={12}>
      <Box
        role="group"
        pt={6}
        maxW="330px"
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
        <Flex mt="6">
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
            btnProps={{
              borderRight: "1px solid",
              borderLeft: "1px solid",
              borderColor: "rgba(255, 255, 255, 0.06)",
            }}
            callback={() => {}}
            icon={<CgFolderAdd fontSize="1.25rem" color="#ffffff" />}
          />
          <CardFooterButton
            callback={() => {}}
            icon={<Image src="/svgs/opensea.svg" alt="opensea-logo" w="20px" />}
          />
          <CardFooterButton
            callback={() => {}}
            icon={<RiShareForwardLine color="#ffffff" fontSize="1.15rem" />}
          />
        </Flex>
      </Box>
    </Center>
  );
}
