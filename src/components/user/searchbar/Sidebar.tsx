// import { ChevronLeft } from '@mui/icons-material';
// import { Box, Drawer, IconButton, Typography, styled } from '@mui/material';
// import React from 'react';
// import PriceSlider from './PriceSlider';
// import { useValue } from '../../../context/ContextProvider';

// const DrawerHeader = styled('div')(({theme})=>({
//   display:'flex',
//   alignItems:'center',
//   justifyContent:'space-between',
//   padding:theme.spacing(0,1),
//   ...theme.mixins.toolbar,
// }))


// interface SidebarProps {
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const Sidebar: React.FC<SidebarProps> = ({isOpen,setIsOpen}) => {
//   const {containerRef} = useValue();
//   return (
//     <Drawer
//     variant='persistent'
//     hideBackdrop={true}
//     open={isOpen}
//     >
//       <DrawerHeader>
//           <Typography>Search or Filter:</Typography>
//           <IconButton onClick={() => setIsOpen(false)}>
//             <ChevronLeft fontSize='large'/>
//           </IconButton>
//       </DrawerHeader>
//       <Box sx={{width:280, p:3}}>
//         <Box ref={containerRef}></Box>
//         <PriceSlider/>
//       </Box>
//     </Drawer>
//   );
// };

// export default Sidebar;