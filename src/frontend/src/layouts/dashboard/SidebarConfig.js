import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import databaseFilled from '@iconify/icons-ant-design/database-filled';
import filterFilled from '@iconify/icons-ant-design/filter-filled';
import editOutlined from '@iconify/icons-ant-design/edit-outlined';
import fileSearchOutlined from '@iconify/icons-ant-design/file-search-outlined';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
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
    title: 'Search Databases',
    path: '/dashboard/searchdatabases',
    icon: getIcon(databaseFilled)
  },
  {
    title: 'Search',
    path: '/dashboard/search',
    icon: getIcon(fileSearchOutlined)
  }
];

export default sidebarConfig;
