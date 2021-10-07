import { Button, chakra, Text, Box } from "@chakra-ui/react";

export function CardFooterButton({ callback, text, icon, btnProps }) {
  return (
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
      onClick={callback}
      {...btnProps}
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
        {icon}
        {text && (
          <chakra.span d={{ base: "none", sm: "flex" }}>
            &nbsp;&nbsp; {text}
          </chakra.span>
        )}
      </Text>
    </Button>
  );
}
