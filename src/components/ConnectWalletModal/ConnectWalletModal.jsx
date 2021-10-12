import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Image,
  Flex,
  Box,
  DarkMode,
  useToast,
  Stack,
  Tooltip,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { SideBarLink } from "..";
import { useNavigate } from "react-router";
import { RiWallet3Fill } from "react-icons/ri";
import useWeb3 from "../../context/Web3/Web3";
import { FaLock } from "react-icons/fa";

function WalletConnectorButton({
  imagePath,
  label,
  onClick,
  isDisabled,
  tooltip,
  imgWidth,
}) {
  return (
    <Tooltip label={tooltip} hasArrow arrowSize={8} isDisabled={!tooltip}>
      <Button
        bg="rgba(255,255,255,0.4)"
        boxShadow="0 2px 6px rgba(0,0,0,0.2), inset 0 1px rgba(255,255,255,0.3), inset 0 10px rgba(255,255,255,0.2), inset 0 10px 20px rgba(255,255,255,0.25), inset 0 -15px 30px rgba(0,0,0,0.3)"
        transition="all 0.2s"
        _hover={{
          bg: "rgba(255,255,255,0.6)",
          boxShadow: "none",
        }}
        onClick={!isDisabled && onClick}
        w="80%"
        rounded="full"
        css={
          isDisabled && {
            background: "rgba(255,255,255,0.1) !important",
            color: "rgba(255,255,255,0.5) !important",
            boxShadow: "none !important",
            cursor: "not-allowed",
          }
        }
        pos="relative"
      >
        <Flex
          h="20px"
          w="20px"
          bg="whiteAlpha.900"
          rounded="full"
          justify="center"
          align="center"
        >
          <Image src={imagePath || "/images/eth.svg"} w={imgWidth || 13} />
        </Flex>
        &nbsp; {label} &nbsp;
        {isDisabled && (
          <Badge colorScheme="cyan" p="4px" rounded="lg">
            <FaLock />
          </Badge>
        )}
      </Button>
    </Tooltip>
  );
}

export function ConnectWalletModal({ navBtn }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const navigate = useNavigate();

  const { loadWeb3Modal, loadTezos } = useWeb3();

  return (
    <DarkMode>
      {navBtn && (
        <Box as="button" textAlign="left" onClick={onOpen}>
          <SideBarLink
            display={{ base: "block", lg: "none" }}
            icon={<RiWallet3Fill fontSize="1rem" />}
            label="Connect Wallet"
          />
        </Box>
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
          bg="rgba(0,0,0,0.5)"
          boxShadow="0 2px 6px rgba(0,0,0,0.5), inset 0 1px rgba(255,255,255,0.3), inset 0 10px rgba(255,255,255,0.2), inset 0 10px 20px rgba(255,255,255,0.25), inset 0 -15px 30px rgba(0,0,0,0.3)"
        >
          <ModalBody p="1rem 0">
            <Stack spacing={4} align="center" p="1rem">
              <WalletConnectorButton
                imagePath="/svgs/eth.svg"
                label="Ethereum"
                imgWidth={20}
                onClick={() => {
                  onClose();
                  loadWeb3Modal();
                }}
              />
              <WalletConnectorButton
                imagePath="https://cryptologos.cc/logos/polygon-matic-logo.svg?v=014"
                label="Polygon"
                imgWidth={13}
                onClick={() => {
                  onClose();
                  loadWeb3Modal();
                }}
              />
              <WalletConnectorButton
                imagePath="https://cryptologos.cc/logos/tezos-xtz-logo.svg?v=014"
                label="Tezos"
                imgWidth={"10px"}
                onClick={() => {
                  onClose();
                  loadTezos();
                }}
              />

              <WalletConnectorButton
                imagePath="https://cryptologos.cc/logos/solana-sol-logo.svg?v=014"
                label="Solana"
                onClick={() => {}}
                tooltip="Coming Soon"
                isDisabled
              />

              <WalletConnectorButton
                imagePath="https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=014"
                label="Avalanche"
                onClick={() => {}}
                tooltip="Coming Soon"
                isDisabled
              />
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </DarkMode>
  );
}
