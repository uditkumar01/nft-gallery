import { Avatar, Flex, Stack, Text, Box } from "@chakra-ui/react";

export const UserInfo = (props) => {
  const { name, image, email } = props;
  return (
    <Flex
      bg="transparent"
      border="1px solid rgba(255, 255, 255, 0.125)"
      boxShadow="2xl"
      w="full"
      rounded="full"
      pos="relative"
      overflow="hidden"
    >
      <Box
        pos="absolute"
        top="0"
        left="0"
        w="100%"
        height="100%"
        background="radial-gradient(circle farthest-side, rgba(0,0,0,0.2), rgba(255,255,255, 0.1))"
        className="bg-blur"
        zIndex={-1}
        overflow="hidden"
      />
      <Avatar size="md" name={name} src={image} />
      <Stack pl="7px" spacing={0} justify="center">
        <Text
          lineHeight="15px"
          fontSize="sm"
          fontWeight="semibold"
          w="164px"
          isTruncated
        >
          {name}
        </Text>
        <Text
          w="160px"
          color="gray.400"
          fontSize="xs"
          lineHeight="20px"
          isTruncated
        >
          {email}
        </Text>
      </Stack>
    </Flex>
  );
};
