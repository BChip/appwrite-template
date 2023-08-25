import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/react'
import { CheckIcon, ChevronDownIcon, BellIcon, DragHandleIcon, HamburgerIcon } from "@chakra-ui/icons";
import useAppwrite from "../hooks/appwrite/useAppwrite";
import { useRouter } from "next/router";

interface LinkItemProps {
  name: string
  icon: typeof Icon
}

interface NavItemProps extends FlexProps {
  icon: typeof Icon
  children: React.ReactNode
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: DragHandleIcon },
]

const AccountItems: Array<LinkItemProps> = [
  { name: 'Profile', icon: DragHandleIcon },
  { name: 'Settings', icon: DragHandleIcon },
  { name: 'Billing', icon: DragHandleIcon }
]

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          My Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  )
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [account, collection, bucket] = useAppwrite();
  const router = useRouter();
  const toast = useToast();
  const onLogoutClick = async () => {
    try {
      await account.operations.logout();
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<HamburgerIcon />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        My Logo
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Popover>
          <PopoverTrigger>
            <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<BellIcon />} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Notifications</PopoverHeader>
            <PopoverBody>No notifications to show</PopoverBody>
          </PopoverContent>
        </Popover>

        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                    `https://ui-avatars.com/api/?name=${account.user?.name}&background=random&length=1&rounded=true`
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{account.user?.name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {account.user?.status}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <ChevronDownIcon />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              {AccountItems.map((link) => (
                <MenuItem key={link.name}>
                  {link.name}
                </MenuItem>
              ))}
              <MenuDivider />
              <MenuItem onClick={async () => {
                const isSuccess = await onLogoutClick();
                if (isSuccess) {
                  router.push("/auth");
                } else {
                  toast({
                    title: "Logout failed",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                }
              }}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}

interface SidebarWithHeaderProps {
  children: React.ReactNode;
}

const SidebarWithHeader: React.FC<SidebarWithHeaderProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {props.children}
      </Box>
    </Box>
  )
}

export default SidebarWithHeader