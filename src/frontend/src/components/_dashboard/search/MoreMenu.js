import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import cloudComputer from '@iconify/icons-grommet-icons/cloud-computer';
import documentHeaderRemove24Regular from '@iconify/icons-fluent/document-header-remove-24-regular';
import listFill from '@iconify/icons-eva/list-fill';
import playCircleFilled from '@iconify/icons-ant-design/play-circle-filled';

// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import {api} from '../../../services';
import { withSnackbar } from '../../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const SearchMoreMenu = (props) => {
  const { row, getData, play} = props
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false)
  const confirm = useConfirm()

  const remove = async (event) =>{
    confirm({ description: 'Confirm removal of this item?' })
      .then(() => {
        api.remove(`search/${row.id}`).then(res=>{
          if (res){
            props.props.showMessageWarning("The Search was removed!")
            getData()
          } else {
            props.props.showMessageError(`Failed to remove this use case. There are dependencies.`)
          }
        })
      })
      .catch(() => { /* ... */ });
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >

        <MenuItem sx={{ color: 'text.primary' }} onClick={(event)=>{play(row.id)}}>
          <ListItemIcon >
            <Icon icon={playCircleFilled} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Play" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`${row.id}/executions`} sx={{ color: 'text.primary' }}>
          <ListItemIcon>
            <Icon icon={listFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Executions" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`${row.id}`} sx={{ color: 'text.primary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.primary' }} onClick={(event)=>{remove(event)}}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

      </Menu>
    </>
  );
}

export default withSnackbar(SearchMoreMenu)

