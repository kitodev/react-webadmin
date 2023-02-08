// Pages
import {
  AppBar,
  Autocomplete,
  Avatars,
  BackendError,
  Badges,
  Blank,
  ButtonNavigation,
  Buttons,
  Calendar,
  Cards,
  Charts,
  Chat,
  Chips,
  Detail,
  Dialogs,
  Dividers,
  Drawers,
  Editor,
  ExpansionPanels,
  Google,
  GridList,
  Home,
  Invoice,
  Leaflet,
  Lists,
  Lockscreen,
  Media,
  Menus,
  Messages,
  NotFound,
  Paper,
  PasswordReset,
  Pickers,
  PricingPage,
  Products,
  Progress,
  SelectionControls,
  Selects,
  Signin,
  Signup,
  Snackbars,
  Social,
  Steppers,
  Tables,
  Tabs,
  Taskboard,
  TextFields,
  TimelinePage,
  Tooltips,
  Widgets
} from './pages';

import AppsIcon from '@material-ui/icons/Apps';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import EqualizerIcon from '@material-ui/icons/Equalizer';
// Icons
import ExploreIcon from '@material-ui/icons/Explore';
import FaceIcon from '@material-ui/icons/Face';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import Looks3Icon from '@material-ui/icons/Looks3';
import Looks4Icon from '@material-ui/icons/Looks4';
import NavigationIcon from '@material-ui/icons/Navigation';
import PagesIcon from '@material-ui/icons/Pages';
import PersonIcon from '@material-ui/icons/Person';
import PhotoIcon from '@material-ui/icons/Photo';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';

export default {
  items: [
    {
      path: '/',
      name: 'Home',
      type: 'link',
      icon: ExploreIcon,
      component: Home
    },
    {
      path: '/apps',
      name: 'Apps',
      type: 'submenu',
      icon: AppsIcon,
      badge: {
        type: 'primary',
        value: '5'
      },
      children: [
        {
          path: '/calendar',
          name: 'Calendar',
          component: Calendar
        },
        {
          path: '/media',
          name: 'Media',
          component: Media
        },
        {
          path: '/messages',
          name: 'Messages',
          component: Messages
        },
        {
          path: '/social',
          name: 'Social',
          component: Social
        },
        {
          path: '/chat',
          name: 'Chat',
          component: Chat
        }
      ]
    },
    {
      path: '/widgets',
      name: 'Widgets',
      type: 'link',
      icon: PhotoIcon,
      component: Widgets
    },
    {
      path: '/material',
      name: 'Material',
      type: 'submenu',
      icon: EqualizerIcon,
      badge: {
        type: 'error',
        value: '10'
      },
      children: [
        {
          path: '/appbar',
          name: 'App Bar',
          component: AppBar
        },
        {
          path: '/autocomplete',
          name: 'Auto Complete',
          component: Autocomplete
        },
        {
          path: '/avatars',
          name: 'Avatars',
          component: Avatars
        },
        {
          path: '/badges',
          name: 'Badges',
          component: Badges
        },
        {
          path: '/button-navigation',
          name: 'Button Navigation',
          component: ButtonNavigation
        },
        {
          path: '/buttons',
          name: 'Buttons',
          component: Buttons
        },
        {
          path: '/cards',
          name: 'Cards',
          component: Cards
        },
        {
          path: '/chips',
          name: 'Chips',
          component: Chips
        },
        {
          path: '/dialogs',
          name: 'Dialogs',
          component: Dialogs
        },
        {
          path: '/dividers',
          name: 'Dividers',
          component: Dividers
        },
        {
          path: '/drawers',
          name: 'Drawers',
          component: Drawers
        },
        {
          path: '/expansion-panels',
          name: 'Expansion Panels',
          component: ExpansionPanels
        },
        {
          path: '/grid-list',
          name: 'Grid List',
          component: GridList
        },
        {
          path: '/lists',
          name: 'Lists',
          component: Lists
        },
        {
          path: '/menus',
          name: 'Menus',
          component: Menus
        },
        {
          path: '/paper',
          name: 'Paper',
          component: Paper
        },
        {
          path: '/pickers',
          name: 'Pickers',
          component: Pickers
        },
        {
          path: '/progress',
          name: 'Progress',
          component: Progress
        },
        {
          path: '/selection-controls',
          name: 'Selection Controls',
          component: SelectionControls
        },
        {
          path: '/selects',
          name: 'Selects',
          component: Selects
        },
        {
          path: '/snackbars',
          name: 'Snackbars',
          component: Snackbars
        },
        {
          path: '/steppers',
          name: 'Steppers',
          component: Steppers
        },
        {
          path: '/tables',
          name: 'Tables',
          component: Tables
        },
        {
          path: '/tabs',
          name: 'Tabs',
          component: Tabs
        },
        {
          path: '/text-fields',
          name: 'Text Fields',
          component: TextFields
        },
        {
          path: '/tooltips',
          name: 'Tooltips',
          component: Tooltips
        }
      ]
    },
    {
      path: '/editor',
      name: 'Editor',
      type: 'link',
      icon: Looks3Icon,
      component: Editor
    },
    {
      path: '/ecommerce',
      name: 'Ecommerce',
      type: 'submenu',
      icon: Looks4Icon,
      badge: {
        type: 'secondary',
        value: 'N'
      },
      children: [
        {
          path: '/products',
          name: 'Products',
          component: Products
        },
        {
          path: '/detail',
          name: 'Detail',
          component: Detail
        }
      ]
    },
    {
      path: '/taskboard',
      name: 'Taskboard',
      type: 'link',
      icon: ViewColumnIcon,
      component: Taskboard
    },
    {
      path: '/charts',
      name: 'Charts',
      type: 'link',
      icon: ShowChartIcon,
      component: Charts
    },
    {
      path: '/maps',
      name: 'Maps',
      type: 'submenu',
      icon: NavigationIcon,
      children: [
        {
          path: '/google',
          name: 'Google',
          component: Google
        },
        {
          path: '/leaflet',
          name: 'Leaflet',
          component: Leaflet
        }
      ]
    },
    {
      path: '/pages',
      name: 'Pages',
      type: 'submenu',
      icon: PagesIcon,
      children: [
        {
          path: '/invoice',
          name: 'Invoice',
          component: Invoice
        },
        {
          path: '/timeline',
          name: 'Timeline',
          component: TimelinePage
        },
        {
          path: '/blank',
          name: 'Blank',
          component: Blank
        },
        {
          path: '/pricing',
          name: 'Pricing',
          component: PricingPage
        }
      ]
    },
    {
      name: 'Authentication',
      type: 'submenu',
      icon: PersonIcon,
      children: [
        {
          path: '/signin',
          name: 'Signin',
          component: Signin
        },
        {
          path: '/signup',
          name: 'Signup',
          component: Signup
        },
        {
          path: '/forgot',
          name: 'Forgot',
          component: PasswordReset
        },
        {
          path: '/lockscreen',
          name: 'Lockscreen',
          component: Lockscreen
        }
      ]
    },
    {
      name: 'Error',
      type: 'submenu',
      icon: FaceIcon,
      children: [
        {
          path: '/404',
          name: '404',
          component: NotFound
        },
        {
          path: '/500',
          name: 'Error',
          component: BackendError
        }
      ]
    },
    {
      path: 'https://iamnyasha.github.io/react-primer-docs/',
      name: 'Documentation',
      type: 'external',
      icon: LocalLibraryIcon
    },
    {
      path: 'https://primer.fusepx.com',
      name: 'Get Angular Version',
      type: 'external',
      icon: BookmarkIcon
    }
  ]
};
