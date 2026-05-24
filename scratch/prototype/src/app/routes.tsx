import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { AlertModelsListPage } from './pages/AlertModelsListPage';
import { CreateAlertModelPage } from './pages/CreateAlertModelPage';
import { MachinesPage } from './pages/MachinesPage';
import { MachineModelsPage } from './pages/MachineModelsPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateMachineModelPage } from './pages/CreateMachineModelPage';
import { CreateMachinePage } from './pages/CreateMachinePage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: () => <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'alert-models', Component: AlertModelsListPage },
      { path: 'alert-models/create', Component: CreateAlertModelPage },
      { path: 'alert-models/:id/edit', Component: CreateAlertModelPage },
      { path: 'machine-models', Component: MachineModelsPage },
      { path: 'machine-models/create', Component: CreateMachineModelPage },
      { path: 'machines', Component: MachinesPage },
      { path: 'machines/create', Component: CreateMachinePage },
      { path: '*', Component: () => <Navigate to="/dashboard" replace /> },
    ],
  },
]);
