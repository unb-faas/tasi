import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import calendarOutline from '@iconify/icons-eva/calendar-outline';
import cloudOutlined from '@iconify/icons-ant-design/cloud-outlined';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import trophyOutlined from '@iconify/icons-ant-design/trophy-outlined';
import appstoreOutlined from '@iconify/icons-ant-design/appstore-outlined';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import {api} from '../../../services';
import { withSnackbar } from '../../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const SearchMoreMenuExecutions = (props) => {
  const { row, getData} = props
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false)
  const confirm = useConfirm()

  const remove = async (event) =>{
    confirm({ description: 'Confirm removal of this item?' })
      .then(() => {
        api.remove(`searchexecution/${row.id}`).then(res=>{
          if (res){
            props.props.showMessageWarning("The Execution was removed!")
            getData()
          } else {
            props.props.showMessageError(`Failed to remove this execution. There are dependencies.`)
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

        <MenuItem component={RouterLink} to={`chunks/${row.id}`} sx={{ color: 'text.primary' }}>
          <ListItemIcon>
            <Icon icon={appstoreOutlined} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Chunks" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>   

        <MenuItem sx={{ color: 'text.primary' }} onClick={(event)=>{remove(event)}}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`results/${row.id}`} sx={{ color: 'text.primary' }}>
          <ListItemIcon>
            <Icon icon={calendarOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Results" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`wordcloud/${row.id}`} sx={{ color: 'text.primary' }}>
          <ListItemIcon>
            <Icon icon={cloudOutlined} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Word Cloud" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`ranking/${row.id}`} sx={{ color: 'text.primary' }}>
          <ListItemIcon>
            <Icon icon={trophyOutlined} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Ranking" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        
      </Menu>
    </>
  );
}

export default withSnackbar(SearchMoreMenuExecutions)

