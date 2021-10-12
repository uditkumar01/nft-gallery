import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";

export const SearchInput = (props) => {
  const { rootProps, ...rest } = props;
  return (
    <InputGroup
      maxW="2xs"
      size="sm"
      variant="filled"
      display={{ base: "none", lg: "block" }}
      {...rootProps}
    >
      <InputLeftElement color="gray.400" pointerEvents="none">
        <BsSearch />
      </InputLeftElement>
      <Input
        {...rest}
        placeholder="Search"
        color="white"
        bg="gray.700"
        _hover={{ bg: "gray.600" }}
        rounded="md"
        _placeholder={{ color: "gray.300" }}
        cursor="pointer"
      />
    </InputGroup>
  );
};
