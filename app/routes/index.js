import React from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router';

// ----------- Pages Imports ---------------
import Analytics from './Dashboards/Analytics';
import ProjectsDashboard from './Dashboards/Projects';
import System from './Dashboards/System';
import Monitor from './Dashboards/Monitor'; 
import Financial from './Dashboards/Financial';
import Stock from './Dashboards/Stock';
import Reports from './Dashboards/Reports';

import Widgets from './Widgets';

import Cards from './Cards/Cards';
import CardsHeaders from './Cards/CardsHeaders';

import NavbarOnly from './Layouts/NavbarOnly';
import SidebarDefault from './Layouts/SidebarDefault';
import SidebarA from './Layouts/SidebarA';
import DragAndDropLayout from './Layouts/DragAndDropLayout';
import SidebarWithNavbar from './Layouts/SidebarWithNavbar';

import Accordions from './Interface/Accordions';
import Alerts from './Interface/Alerts';
import Avatars from './Interface/Avatars';
import BadgesLabels from './Interface/BadgesLabels';
import Breadcrumbs from './Interface/Breadcrumbs';
import Buttons from './Interface/Buttons';
import Colors from './Interface/Colors';
import Dropdowns from './Interface/Dropdowns';
import Images from './Interface/Images';
import ListGroups from './Interface/ListGroups';
import MediaObjects from './Interface/MediaObjects';
import Modals from './Interface/Modals';
import Navbars from './Interface/Navbars';
import Paginations from './Interface/Paginations';
import ProgressBars from './Interface/ProgressBars';
import TabsPills from './Interface/TabsPills';
import TooltipPopovers from './Interface/TooltipsPopovers';
import Typography from './Interface/Typography';
import Notifications from './Interface/Notifications';
import CropImage from './Interface/CropImage';
import DragAndDropElements from './Interface/DragAndDropElements';
import Calendar from './Interface/Calendar';
import ReCharts from './Graphs/ReCharts';

import Forms from './Forms/Forms';
import FormsLayouts from './Forms/FormsLayouts';
import InputGroups from './Forms/InputGroups';
import Wizard from './Forms/Wizard';
import TextMask from './Forms/TextMask';
import Typeahead from './Forms/Typeahead';
import Toggles from './Forms/Toggles';
import Editor from './Forms/Editor';
import DatePicker from './Forms/DatePicker';
import Dropzone from './Forms/Dropzone';
import Sliders from './Forms/Sliders';

import Tables from './Tables/Tables';
import FindGroups from './Views/Students/FindGroups';
import MyFindGroup from './Views/Students/MyFindGroup';
import MyTopic from './Views/Students/MyTopic';
import ViewTopicMentor from './Views/Students/ViewTopicMentor';
import ApproveTopic from './Views/Topic/ApproveTopic';
import TopicForMentor from './Views/Topic/TopicForMentor';
import ApproveTopicDetails from './Views/Topic/ApproveTopicDetails';
import MeetingSchedule from './Views/MeetingSchedule';

import Groups from './Views/Students/Groups';
import GroupsDetails from './Views/Students/GroupsDetails';
import MyGroup from './Views/Students/MyGroup';
import ExtendedTable from './Tables/ExtendedTable';
import AgGrid from './Tables/AgGrid';

import AccountEdit from './Views/Profile/AccountEdit';
import BillingEdit from './Apps/BillingEdit';
import Chat from './Apps/Chat';
import Clients from './Apps/Clients';
import EmailDetails from './Apps/EmailDetails';
import Files from './Apps/Files';
import GalleryGrid from './Apps/GalleryGrid';
import GalleryTable from './Apps/GalleryTable';
import ImagesResults from './Apps/ImagesResults';
import Inbox from './Apps/Inbox';
import NewEmail from './Apps/NewEmail';
import ProjectMentor from './Views/Projects/ProjectMentor';
import ProfileDetails from './Views/Profile/ProfileDetails';
import ViewProfile from './Views/Profile/ViewProfile';
import ProfileDetailsDemo from './Apps/ProfileDetails';
import ProfileEdit from './Views/Profile/ProfileEdit';
import Projects from './Views/Projects/Projects';
import SearchResults from './Apps/SearchResults';
import SessionsEdit from './Apps/SessionsEdit';
import SettingsEdit from './Apps/SettingsEdit';
import TasksList from './Views/Tasks/TasksList';
import MyTasksList from './Views/Tasks/MyTasksList';
import TasksKanban from './Views/Tasks/TasksKanban';
import MyTasksKanban from './Views/Tasks/MyTasksKanban';
import TasksDetails from './Views/TasksDetails';
import Users from './Apps/Users';
import UsersResults from './Apps/UsersResults';
import VideosResults from './Apps/VideosResults';
import ProjectProgressMentor from './Views/Projects/ProjectProgressMentor';
import ProjectProgressStudent from './Views/Projects/ProjectProgressStudent';
import ExeSyllabus from './Views/Syllabus/ExeSyllabus';

import ComingSoon from './Pages/ComingSoon';
import Confirmation from './Pages/Confirmation';
import Danger from './Pages/Danger';
import Error404 from './Pages/Error404';
import LockScreen from './Pages/LockScreen';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Success from './Pages/Success';
// import Timeline from './Pages/Timeline';
import RolePermission from './Views/RolePermission';
import User from './Views/Users';
import ChatGroup from './Views/Chat';
import Workshop from './Views/Workshop';
import Timeline from './Views/Timeline';
import ConfigSystem from './Views/ConfigSystem';
import Group from './Views/Group';

import Icons from './Icons';

// ----------- New Edit ---------------
import SignIn from './Views/Auth/SignIn';
import ForgotPassword from './Views/Auth/ForgotPassword';
import MentorDashboard from './Views/Dashboard/MentorDashboard';
import ManagerDashboard from './Views/Dashboard/ManagerDashboard';
import MileStones from './Views/MileStone/MileStones';
import Documents from './Views/Document/Documents';


// ----------- Layout Imports ---------------
import { DefaultNavbar } from './../layout/components/DefaultNavbar';
import { DefaultSidebar } from './../layout/components/DefaultSidebar';

import { SidebarANavbar } from './../layout/components/SidebarANavbar';
import { SidebarASidebar } from './../layout/components/SidebarASidebar';

//------ Route Definitions --------
// eslint-disable-next-line no-unused-vars
export const RoutedContent = () => {
    return (
        <Switch>
            <Redirect from="/" to="/auth/signin" exact />
            
            { /*    Cards Dashboard     */ }
            <Route path="/dashboards/mentor" exact component={MentorDashboard} />
            <Route path="/dashboards/manager" exact component={ManagerDashboard} />


            <Route path="/Views/Students/GroupsDetails" exact component={GroupsDetails} />
            <Route path="/Views/Topic/ApproveTopicDetails" exact component={ ApproveTopicDetails } />


            <Route path="/dashboards/analytics" exact component={Analytics} />
            <Route path="/dashboards/projects" exact component={ProjectsDashboard} />
            <Route path="/dashboards/system" exact component={System} />
            <Route path="/dashboards/monitor" exact component={Monitor} />
            <Route path="/dashboards/financial" exact component={Financial} />
            <Route path="/dashboards/stock" exact component={Stock} />
            <Route path="/dashboards/reports" exact component={Reports} />

            <Route path='/widgets' exact component={Widgets} />
            
            { /*    Cards Routes     */ }
            <Route path='/cards/cards' exact component={Cards} />
            <Route path='/cards/cardsheaders' exact component={CardsHeaders} />
            
            { /*    Layouts     */ }
            <Route path='/layouts/navbar' component={NavbarOnly} />
            <Route path='/layouts/sidebar' component={SidebarDefault} />
            <Route path='/layouts/sidebar-a' component={SidebarA} />
            <Route path="/layouts/sidebar-with-navbar" component={SidebarWithNavbar} />
            <Route path='/layouts/dnd-layout' component={DragAndDropLayout} />

            { /*    Interface Routes   */ }
            <Route component={ Accordions } path="/interface/accordions" />
            <Route component={ Alerts } path="/interface/alerts" />
            <Route component={ Avatars } path="/interface/avatars" />
            <Route component={ BadgesLabels } path="/interface/badges-and-labels" />
            <Route component={ Breadcrumbs } path="/interface/breadcrumbs" />
            <Route component={ Buttons } path="/interface/buttons" />
            <Route component={ Colors } path="/interface/colors" />
            <Route component={ Dropdowns } path="/interface/dropdowns" />
            <Route component={ Images } path="/interface/images" />
            <Route component={ ListGroups } path="/interface/list-groups" />
            <Route component={ MediaObjects } path="/interface/media-objects" />
            <Route component={ Modals } path="/interface/modals" />
            <Route component={ Navbars } path="/interface/navbars" />
            <Route component={ Paginations } path="/interface/paginations" />
            <Route component={ ProgressBars } path="/interface/progress-bars" />
            <Route component={ TabsPills } path="/interface/tabs-pills" />
            <Route component={ TooltipPopovers } path="/interface/tooltips-and-popovers" />
            <Route component={ Typography } path="/interface/typography" />
            <Route component={ Notifications } path="/interface/notifications" />
            <Route component={ CropImage } path="/interface/crop-image" />
            <Route component={ DragAndDropElements } path="/interface/drag-and-drop-elements" />
            <Route component={ Calendar } path="/interface/calendar" />

            { /*    Forms Routes    */ }
            <Route component={ Forms } path="/forms/forms" />
            <Route component={ FormsLayouts } path="/forms/forms-layouts" />
            <Route component={ InputGroups } path="/forms/input-groups" />
            <Route component={ Wizard } path="/forms/wizard" />
            <Route component={ TextMask } path="/forms/text-mask" />
            <Route component={ Typeahead } path="/forms/typeahead" />
            <Route component={ Toggles } path="/forms/toggles" />
            <Route component={ Editor } path="/forms/editor" />
            <Route component={ DatePicker } path="/forms/date-picker" />
            <Route component={ Dropzone } path="/forms/dropzone" />
            <Route component={ Sliders } path="/forms/sliders" />
            
            { /*    Graphs Routes   */ }
            <Route component={ ReCharts } path="/graphs/re-charts" />

            { /*    Tables Routes   */ }
            <Route component={ Tables } path="/tables/tables" />
            <Route component={ FindGroups } path="/Views/Students/FindGroups" />
            <Route component={ MyFindGroup } path="/Views/Students/MyFindGroup" />
            <Route component={ MyTopic } path="/Views/Students/MyTopic" />
            <Route component={ ViewTopicMentor } path="/Views/Students/ViewTopicMentor" />
            <Route component={ ApproveTopic } path="/Views/Topic/ApproveTopic" />
            <Route component={ TopicForMentor } path="/Views/Topic/TopicForMentor" />


            <Route component={ MyGroup } path="/Views/Students/MyGroup" />
            <Route component={ Groups } path="/Views/Students/Groups" />
            <Route component={ ExtendedTable } path="/tables/extended-table" />
            <Route component={ RolePermission } path="/views/role-permission" />
            <Route component={ User } path="/views/users" />
            <Route component={ ChatGroup } path="/views/chat" />
            <Route component={ MeetingSchedule } path="/views/meeting-schedule" />
            <Route component={ Workshop } path="/views/workshop" />
            <Route component={ Timeline } path="/views/timeline" />
            <Route component={ AgGrid } path="/tables/ag-grid" />

            { /*    Apps Routes     */ }
            <Route component={ AccountEdit } path="/Views/Profile/AccountEdit" />
            <Route component={ BillingEdit } path="/apps/billing-edit" />
            <Route component={ Chat } path="/apps/chat" />
            <Route component={ Clients } path="/apps/clients" />
            <Route component={ EmailDetails } path="/apps/email-details" />
            <Route component={ Files } path="/apps/files/:type"/>
            <Route component={ GalleryGrid } path="/apps/gallery-grid" />
            <Route component={ GalleryTable } path="/apps/gallery-table" />
            <Route component={ ImagesResults } path="/apps/images-results" />
            <Route component={ Inbox } path="/apps/inbox" />
            <Route component={ NewEmail } path="/apps/new-email" />
            <Route component={ ProjectMentor } path="/Views/Projects/ProjectMentor" />
            <Route component={ ProfileDetails } path="/Views/Profile/ProfileDetails" />
            <Route component={ ViewProfile } path="/Views/Profile/ViewProfile/:userId" />
            <Route component={ ProfileDetailsDemo } path="/apps/ProfileDetailsDemo" />
            <Route component={ ProfileEdit } path="/Views/Profile/ProfileEdit" />
            <Route component={ Projects } path="/apps/projects/:type" />
            <Route component={ SearchResults } path="/apps/search-results" />
            <Route component={ SessionsEdit } path="/apps/sessions-edit" />
            <Route component={ SettingsEdit } path="/apps/settings-edit" />
            <Route component={ TasksList } path="/apps/tasks-list" />
            <Route component={ MyTasksList } path="/apps/my-tasks-list" />
            <Route component={ TasksKanban } path="/apps/tasks-kanban" />
            <Route component={ MyTasksKanban } path="/apps/my-tasks-kanban" />
            <Route component={ TasksDetails } path="/apps/task-details/:taskId" />
            <Route component={ ProjectProgressMentor } path="/apps/mentor/project/progress/:projectId" />
            <Route component={ ProjectProgressStudent } path="/apps/student/project/progress" />
            <Route component={ ExeSyllabus } path="/apps/syllabus/exe" />
            <Route component={ ConfigSystem } path="/views/configsystem" />
            <Route component={ Group } path="/views/group" />

            <Route component={ ForgotPassword } path="/auth/forgotpassword" />
            <Route component={ MileStones } path="/apps/milestones" />
            <Route component={ Documents } path="/apps/mentor/project/document/:projectId" />


            <Route component={ Users } path="/apps/users/:type" />
            <Route component={ UsersResults } path="/apps/users-results" />
            <Route component={ VideosResults } path="/apps/videos-results" />

            { /*    Pages Routes    */ }
            <Route component={ ComingSoon } path="/pages/coming-soon" />
            <Route component={ Confirmation } path="/pages/confirmation" />
            <Route component={ Danger } path="/pages/danger" />
            <Route component={ Error404 } path="/pages/error-404" />
            <Route component={ LockScreen } path="/pages/lock-screen" />
            <Route component={ Login } path="/pages/login" />
            <Route component={ Register } path="/pages/register" />
            <Route component={ Success } path="/pages/success" />
            {/* <Route component={ Timeline } path="/pages/timeline" /> */}

            <Route path='/icons' exact component={Icons} />
            { /*    New Edit    */ }
            <Route component={ SignIn } path="/auth/signin" />


            { /*    404    */ }
            <Redirect to="/pages/error-404" />
        </Switch>
    );
};

//------ Custom Layout Parts --------
export const RoutedNavbars  = () => (
    <Switch>
        { /* Other Navbars: */}
        <Route
            component={ SidebarANavbar }
            path="/layouts/sidebar-a"
        />
        <Route
            component={ NavbarOnly.Navbar }
            path="/layouts/navbar"
        />
        <Route
            component={ SidebarWithNavbar.Navbar }
            path="/layouts/sidebar-with-navbar"
        />
        { /* Default Navbar: */}
        <Route
            component={ DefaultNavbar }
        />
    </Switch>  
);

export const RoutedSidebars = () => (
    <Switch>
        { /* Other Sidebars: */}
        <Route
            component={ SidebarASidebar }
            path="/layouts/sidebar-a"
        />
        <Route
            component={ SidebarWithNavbar.Sidebar }
            path="/layouts/sidebar-with-navbar"
        />
        { /* Default Sidebar: */}
        <Route
            component={ DefaultSidebar }
        />
    </Switch>
);
