import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { Layout, type ModuleType } from './components/Layout';
import { LoginScreen } from './components/LoginScreen';
import { KanbanBoard } from './modules/KanbanBoard';
import { CRMLeads } from './modules/CRMLeads';
import { AICopilot } from './modules/AICopilot';
import { DailyRoutineModule } from './modules/DailyRoutine';
import { Dashboard } from './modules/Dashboard';
import { TeamTasksModule } from './modules/TeamTasks';
import { SharedNotesModule } from './modules/SharedNotes';
import { ReportHub } from './modules/ReportHub';
import { GuideModule } from './modules/GuideModule';

function MainWorkspace() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <WorkspaceProvider>
      <Layout activeModule={activeModule} setActiveModule={setActiveModule}>
        {activeModule === 'dashboard' && <Dashboard />}
        {activeModule === 'daily' && <DailyRoutineModule />}
        {activeModule === 'kanban' && <KanbanBoard />}
        {activeModule === 'crm' && <CRMLeads />}
        {activeModule === 'team' && <TeamTasksModule />}
        {activeModule === 'notes' && <SharedNotesModule />}
        {activeModule === 'report' && <ReportHub />}
        {activeModule === 'copilot' && <AICopilot />}
        {activeModule === 'guide' && <GuideModule />}
      </Layout>
    </WorkspaceProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainWorkspace />
    </AuthProvider>
  );
}

export default App;
