import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import Sheet from '@mui/joy/Sheet';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import SendIcon from '@mui/icons-material/Send';

const Footer = () => {
  const [color, setColor] = React.useState<ColorPaletteProp>('neutral');
  return (
    <Sheet
      variant="solid"
      color="primary"
      invertedColors
      sx={{
        ...(color !== 'neutral' && {
          bgcolor: `${color}.800`,
        }),
        flexGrow: 1,
        p: 2,
        borderRadius: { xs: 0, sm: 'sm' },
        position: 'fixed',
        bottom: 0,
        width: '100%',
      }}
    >
      <Box component="footer" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Divider orientation="vertical" />
        <IconButton variant="plain">
          <FacebookRoundedIcon />
        </IconButton>
        <IconButton variant="plain">
          <GitHubIcon />
        </IconButton>
        <Input
          variant="soft"
          placeholder="Type in your email"
          type="email"
          name="email"
          endDecorator={
            <IconButton variant="soft" aria-label="subscribe">
              <SendIcon />
            </IconButton>
          }
          sx={{ ml: 'auto', display: { xs: 'none', md: 'flex' } }}
        />
      </Box>
      <Divider sx={{ my: 1 }} />
    </Sheet>
  );
}

export default Footer;
