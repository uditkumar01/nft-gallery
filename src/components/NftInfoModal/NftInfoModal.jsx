import { DarkMode } from "@chakra-ui/color-mode";
import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import {
  Badge,
  Box,
  Center,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/layout";
import { Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/modal";
import { Table, Tbody, Td, Th, Tr } from "@chakra-ui/table";
import { useToast } from "@chakra-ui/toast";
import { useRef, useState } from "react";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import { RiEyeLine, RiShareForwardLine } from "react-icons/ri";
import { CardFooterButton } from "..";
import { randomCoords } from "../../pages/Landing/Landing";
import { colors } from "../Card/Card";

export function NftInfoModal({
  footerBtn,
  name,
  creator_address,
  userAddress,
  contract_address,
  token_id,
  url,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const toast = useToast();

  const nftInfo = [
    {
      label: "Name",
      value: name,
    },
    {
      label: "Created By",
      value: creator_address,
    },
    {
      label: "Owned By",
      value: userAddress,
    },
    {
      label: "Contract Address",
      value: contract_address,
    },
    {
      label: "Token ID",
      value: token_id,
    },
  ];

  return (
    <DarkMode>
      {footerBtn && (
        <CardFooterButton
          btnProps={{
            borderRight: "1px solid",
            borderLeft: "1px solid",
            borderColor: "rgba(255, 255, 255, 0.06)",
          }}
          callback={onOpen}
          icon={<RiEyeLine color="#ffffff" fontSize="1.15rem" />}
        />
      )}

      <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          bg="rgba(40,40,40,0.9)"
          boxShadow="0 2px 6px rgba(0,0,0,0.5), inset 0 1px rgba(255,255,255,0.3), inset 0 10px rgba(255,255,255,0.2), inset 0 10px 20px rgba(255,255,255,0.25), inset 0 -15px 30px rgba(0,0,0,0.3)"
        >
          <ModalBody p="1rem 0">
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

                <Stack pt={10} align="center" w="full">
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
                      #{token_id}
                    </Text>
                  </Text>
                  <Table size="sm" w="full">
                    <Tbody>
                      {nftInfo?.map(({ label, value }) => {
                        return (
                          <Tr>
                            <Th border="none" color="whiteAlpha.700">
                              <Text ml="1rem" fontWeight="medium">
                                {label}
                              </Text>
                            </Th>
                            <Td
                              justifyContent="flex-end"
                              d="flex"
                              border="none"
                              color="whiteAlpha.800"
                              isNumeric
                            >
                              <Text
                                bg="rgba(0,0,0,0.6)"
                                p={1}
                                rounded="md"
                                fontWeight="medium"
                                w="fit-content"
                                mr="1rem"
                                maxW="150px"
                                isTruncated
                              >
                                {value}
                              </Text>
                              <Flex
                                bg="green.600"
                                h={5}
                                w={5}
                                rounded="md"
                                justify="center"
                                align="center"
                                cursor="pointer"
                                onClick={() => {
                                  navigator.clipboard.writeText(value);
                                  toast({
                                    title: "Copied Successfully",
                                    description: "Value copied to clipboard",
                                    status: "success",
                                    duration: 2000,
                                    isClosable: true,
                                  });
                                }}
                              >
                                <HiOutlineClipboardCopy />
                              </Flex>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Stack>
              </Flex>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </DarkMode>
  );
}
