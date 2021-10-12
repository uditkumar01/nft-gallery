import { Box, HStack } from "@chakra-ui/react";

export const SideBarLink = (props) => {
  const { active, subtle, icon, children, label, endElement } = props;
  return (
    <HStack
      w="full"
      px="3"
      py="2"
      cursor="pointer"
      userSelect="none"
      rounded="md"
      transition="all 0.2s"
      pos="relative"
      border="1px solid rgba(255, 255, 255, 0.06)"
      boxShadow={active ? "2xl" : "xl"}
      transiton="all 0.2s"
      _hover={{
        boxShadow: "2xl",
        border: "1px solid rgba(255, 255, 255, 0.4)",
      }}
      overflow="hidden"
    >
      <Box
        pos="absolute"
        top="0"
        left="0"
        w="100%"
        height="100%"
        background="radial-gradient(circle farthest-side, rgba(0,0,0,0.1), rgba(255,255,255, 0.1))"
        className="bg-blur"
        zIndex={-1}
        overflow="hidden"
      />
      <Box fontSize="lg" color={active ? "currentcolor" : "gray.400"}>
        {icon}
      </Box>
      <Box
        flex="1"
        fontWeight="inherit"
        color={subtle ? "gray.400" : undefined}
        pl="0.5rem"
      >
        {label}
      </Box>
      {endElement && !children && <Box>{endElement}</Box>}
      {/* {children && <Box fontSize="xs" flexShrink={0} as={BsCaretRightFill} />} */}
    </HStack>
  );
};
