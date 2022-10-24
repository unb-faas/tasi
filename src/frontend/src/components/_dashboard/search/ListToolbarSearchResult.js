import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import refreshFill from '@iconify/icons-eva/refresh-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
import outlineRefresh from '@iconify/icons-ic/outline-refresh';
import cloudComputer from '@iconify/icons-grommet-icons/cloud-computer';
import documentHeaderRemove24Regular from '@iconify/icons-fluent/document-header-remove-24-regular';
import { Link as RouterLink } from 'react-router-dom';


// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  Grid,
  OutlinedInput,
  InputAdornment,
  Button,
  MenuItem, 
  ListItemIcon, 
  ListItemText
} from '@material-ui/core';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

SearchListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function SearchListToolbar(props) {
  const { numSelected, filterName, onFilterName, replay, selected} = props
  
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 && (
        <fragment>
            <Grid container>
                <Grid item xs={11}>
                    <Typography component="div" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <MenuItem onClick={(event)=>{replay(selected)}} sx={{ color: 'text.primary' }}>
                        <ListItemIcon>
                            <Tooltip title="Replay">
                                <Icon icon={refreshFill} width={24} height={24} />
                            </Tooltip>
                            </ListItemIcon>
                        <ListItemText primary="" primaryTypographyProps={{ variant: 'body2' }} />
                    </MenuItem>    
                </Grid>
            </Grid>    
            
            
        </fragment>
      ) }
    </RootStyle>
  );
}
