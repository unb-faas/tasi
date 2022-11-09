import { Icon } from '@iconify/react';
import dashboardFilled from '@iconify/icons-ant-design/dashboard-filled';
import databaseFilled from '@iconify/icons-ant-design/database-filled';
import filterFilled from '@iconify/icons-ant-design/filter-filled';
import editOutlined from '@iconify/icons-ant-design/edit-outlined';
import fileSearchOutlined from '@iconify/icons-ant-design/file-search-outlined';
import appstoreAddOutlined from '@iconify/icons-ant-design/appstore-add-outlined';
// ----------------------------------------------------------------------


const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(dashboardFilled)
  },
  {
    title: 'Word Replace',
    path: '/dashboard/wordreplace',
    icon: getIcon(editOutlined)
  },
  {
    title: 'Word Filter',
    path: '/dashboard/wordfilter',
    icon: getIcon(filterFilled)
  },
  {
    title: 'Category',
    path: '/dashboard/category',
    icon: getIcon(appstoreAddOutlined)
  },
  {
    title: 'Search Databases',
    path: '/dashboard/searchdatabase',
    icon: getIcon(databaseFilled)
  },
  {
    title: 'Search',
    path: '/dashboard/search',
    icon: getIcon(fileSearchOutlined)
  }
];

export default sidebarConfig;
