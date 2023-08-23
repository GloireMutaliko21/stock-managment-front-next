import { toggleSidebar } from '@/features/sidebar';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { postLocalRequest } from '@/lib/api';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CategoryIcon from '@mui/icons-material/Category';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';
import InventoryIcon from '@mui/icons-material/Inventory';
import LightModeIcon from '@mui/icons-material/LightMode';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StorageIcon from '@mui/icons-material/Storage';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SummarizeIcon from '@mui/icons-material/Summarize';
import SyncIcon from '@mui/icons-material/Sync';
import { AppBar, Box, Divider, Link, Toolbar } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Container from '@mui/material/Container';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useDarkMode } from 'next-dark-mode';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
dayjs.extend(localizedFormat);

const MainContainer: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);
  const { isOpen } = useTypedSelector((state) => state.sidebar);
  const [openPopper, setOpenPopper] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const { push, route, reload, replace } = useRouter();
  const { darkModeActive, switchToDarkMode, switchToLightMode } = useDarkMode();
  const [fullscreen, setFullscreen] = React.useState(false);

  const navigation1 = [
    {
      path: '/',
      label: 'Dashboard',
      show: true,
      icon: <DashboardIcon />,
    },
    {
      path: '/categories',
      label: 'Catégories',
      show: currentUser?.user?.role !== 'SELLER',
      icon: <CategoryIcon />,
    },
    {
      path: '/products',
      label: 'Produits en stock',
      show: currentUser?.user?.role === 'SUPER_ADMIN',
      icon: <PhonelinkSetupIcon />,
    },
  ];

  const navigation2 = [
    {
      path: '/provides',
      label: 'Approvisionnements',
      show: true,
      icon: <FeaturedPlayListIcon />,
    },
    {
      path: '/my-products',
      label: 'Mes produits',
      show: true,
      icon: <StorageIcon />,
    },
    {
      path: '/sales',
      label: 'Ventes',
      show: currentUser?.user?.role !== 'SELLER',
      icon: <ShoppingBasketIcon />,
    },
    {
      path: '/inventory',
      label: 'Inventaire',
      show: currentUser?.user?.role === 'SUPER_ADMIN',
      icon: <InventoryIcon />,
    },
  ];

  const navigation3 = [
    {
      path: '/suppliers',
      label: 'Fournisseur',
      show: currentUser?.user?.role === 'SUPER_ADMIN',
      icon: <StorefrontIcon />,
    },
    {
      path: '/provides/history',
      label: "Historique d'approvisionnements",
      show: true,
      icon: <HistoryIcon />,
    },
    {
      path: '/sales/history',
      label: 'Historique de ventes',
      show: currentUser?.user?.role === 'SELLER',
      icon: <SummarizeIcon />,
    },
    {
      path: '/users-products',
      label: 'Produits par utilisateur',
      show: currentUser?.user?.role !== 'SELLER',
      icon: <GroupIcon />,
    },
    {
      path: '/users',
      label: 'Utilisateurs',
      show: currentUser?.user?.role === 'SUPER_ADMIN',
      icon: <ManageAccountsIcon />,
    },
  ];

  const toggleMode = () => {
    darkModeActive ? switchToLightMode() : switchToDarkMode();
  };

  const refresh = () => {
    reload();
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    }
  };

  const handleClickMenu = (path: string) => {
    if (isMobile) {
      dispatch(toggleSidebar());
    }
    push(path);
  };

  const handleClosePopper = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenPopper(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenPopper(false);
    } else if (event.key === 'Escape') {
      setOpenPopper(false);
    }
  }

  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const onLogout = async () => {
    await postLocalRequest({ endpoint: '/api/logout' });
    replace('/login');
  };

  return (
    <Box sx={{ bgcolor: 'action.hover' }}>
      <Stack
        sx={{
          bgcolor: 'background.paper',
          width: isOpen ? { xs: 1, md: '18vw' } : { xs: 0, md: 80 },
          position: 'fixed',
          left: 0,
          bottom: 0,
          top: 0,
          zIndex: 2,
          overflow: 'hidden',
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          transition: (theme) => theme.transitions.create(['width', 'margin']),
        }}
      >
        <AppBar variant="outlined" elevation={0}>
          <Toolbar>
            <Stack sx={{ p: 1 }} direction="row" spacing={2}>
              <Stack sx={{ width: 22, height: 22, position: 'relative' }}>
                <Image alt="logo" src="/logo.jpeg" layout="fill" objectFit="contain" />
              </Stack>
              {isOpen && <Typography variant="caption">EbenShop</Typography>}
            </Stack>
          </Toolbar>
        </AppBar>
        <Stack
          sx={{
            transition: (theme) => theme.transitions.create(['margin']),
            px: 2,
            py: 2.5,
            mt: 6,
          }}
          spacing={4}
        >
          <List>
            {navigation1?.map(({ path, icon, label, show }) =>
              show ? (
                <ListItemButton key={path} selected={path === route} onClick={() => handleClickMenu(path)}>
                  <Tooltip title={label} arrow>
                    <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
                  </Tooltip>
                  <ListItemText sx={{ ml: '-10px' }} primary={label} primaryTypographyProps={{ noWrap: true }} />
                </ListItemButton>
              ) : null
            )}

            <Divider sx={{ my: 2 }} />

            {navigation2?.map(({ path, icon, label, show }) =>
              show ? (
                <ListItemButton key={path} selected={path === route} onClick={() => handleClickMenu(path)}>
                  <Tooltip title={label} arrow>
                    <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
                  </Tooltip>
                  <ListItemText sx={{ ml: '-10px' }} primary={label} primaryTypographyProps={{ noWrap: true }} />
                </ListItemButton>
              ) : null
            )}

            <Divider sx={{ my: 2 }} />

            {navigation3?.map(({ path, icon, label, show }) =>
              show ? (
                <ListItemButton key={path} selected={path === route} onClick={() => handleClickMenu(path)}>
                  <Tooltip title={label} arrow>
                    <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
                  </Tooltip>
                  <ListItemText sx={{ ml: '-10px' }} primary={label} primaryTypographyProps={{ noWrap: true }} />
                </ListItemButton>
              ) : null
            )}
          </List>
        </Stack>
      </Stack>
      <Box
        sx={{
          ml: { xs: 0, md: isOpen ? '18vw' : 10 },
          transition: (theme) => theme.transitions.create(['margin']),
          position: 'relative',
        }}
      >
        <AppBar position="sticky" variant="outlined" elevation={0} sx={{ bgcolor: 'background.paper' }}>
          <Toolbar>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={handleToggleSidebar}>{!isOpen ? <MenuIcon /> : <MenuOpenIcon />}</IconButton>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0}>
                <IconButton onClick={refresh}>
                  <SyncIcon
                    sx={{
                      '&:hover': {
                        transform: 'rotate(90deg)',
                        transition: 'transform 0.8s ease',
                      },
                    }}
                  />
                </IconButton>
                <IconButton onClick={toggleMode} sx={{ color: 'white' }}>
                  {darkModeActive ? <DarkModeIcon /> : <LightModeIcon color="warning" />}
                </IconButton>
                <IconButton
                  ref={anchorRef}
                  aria-controls={openPopper ? 'composition-menu' : undefined}
                  aria-expanded={openPopper ? 'true' : undefined}
                  sx={{ color: 'white' }}
                  onClick={handleToggle}
                >
                  <AccountCircleIcon />
                </IconButton>
                {/* @ts-ignore */}
                <Popper
                  open={openPopper}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  placement="bottom-start"
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClosePopper}>
                          <MenuList
                            autoFocusItem={openPopper}
                            id="composition-menu"
                            aria-labelledby="composition-button"
                            onKeyDown={handleListKeyDown}
                          >
                            <MenuItem onClick={() => push('/profile')}>Profile</MenuItem>
                            <MenuItem onClick={onLogout}>Déconnexion</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>

                <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                  {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ py: 3, minHeight: '100vh' }}>
          {children}
        </Container>
        <Paper variant="outlined" square sx={{ width: 1, position: 'fixed', bottom: 0, py: 1 }}>
          <Typography variant="caption" component="p" textAlign="center">
            La Merva Shop &copy; {new Date().getFullYear()} Powered by{' '}
            <Link color="primary" target="_blank" href="https://gloire-mutaliko.vercel.app">
              Gloire M & Merveille Nkerimwami Devs
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default MainContainer;
