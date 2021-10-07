import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  DarkMode,
} from "@chakra-ui/react";
import { HiChevronRight } from "react-icons/hi";

export const NavBreadCrumb = ({ crumbs }) => (
  <DarkMode>
    <Breadcrumb
      fontSize="sm"
      color="gray.500"
      separator={
        <Box
          as={HiChevronRight}
          color="gray.400"
          fontSize="md"
          top="2px"
          pos="relative"
        />
      }
    >
      {crumbs.map((item) => (
        <BreadcrumbItem key={item?.name} color="inherit" isCurrentPage>
          <BreadcrumbLink textDecoration="none !important" fontSize="1rem">
            {item?.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  </DarkMode>
);
