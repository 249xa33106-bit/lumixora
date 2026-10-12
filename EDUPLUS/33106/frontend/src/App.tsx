import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { StudentsPage } from './components/students/StudentsPage';
import { TopicAnalysisPage } from './components/topics/TopicAnalysisPage';
import { ActionCentrePage } from './components/actions/ActionCentrePage';
import { InterventionsPage } from './components/interventions/InterventionsPage';
import { TestImportPage } from './components/imports/TestImportPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { ActionModal } from './components/actions/ActionModal';
import { api } from './services/api';
import {
  Batch,
  User,
  Institution,
  DashboardSummary,
  TopicGap,
  Student,
  TeacherAction
} from './types';

export function App() {
  const [isLandingOpen, setIsLandingOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);

  // Core Data
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Tab Data
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [topicGaps, setTopicGaps] = useState<TopicGap[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [actions, setActions] = useState<TeacherAction[]>([]);

  // Search & Filter state for students
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [studentStatusFilter, setStudentStatusFilter] = useState<string>('all');

  // Quick Action Modal
  const [showQuickActionModal, setShowQuickActionModal] = useState<boolean>(false);
  const [quickActionPrefill, setQuickActionPrefill] = useState<any>(null);

  // Initial Load
  useEffect(() => {
    loadBaseMetadata();
  }, []);

  // Reload tab-specific data when batch filter changes
  useEffect(() => {
    loadDashboardData();
    loadStudents();
    loadActions();
  }, [selectedBatchId]);

  // Search/Filter effect for students
  useEffect(() => {
    loadStudents();
  }, [studentSearch, studentStatusFilter, selectedBatchId]);

  const loadBaseMetadata = async () => {
    try {
      const [inst, bList, uList] = await Promise.all([
        api.getInstitutionProfile(),
        api.getBatches(),
        api.getUsers(),
      ]);
      setInstitution(inst);
      setBatches(bList);
      setUsers(uList);
      if (uList.length > 0 && !currentUser) {
        setCurrentUser(uList[0]); // Default to Academic Coordinator
      }
    } catch (err) {
      console.error('Failed to load initial metadata:', err);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [sum, gaps] = await Promise.all([
        api.getDashboardSummary(selectedBatchId || undefined),
        api.getTopicGaps(selectedBatchId || undefined),
      ]);
      setDashboardSummary(sum);
      setTopicGaps(gaps);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const loadStudents = async () => {
    try {
      const sList = await api.getStudents(
        selectedBatchId || undefined,
        studentSearch || undefined,
        studentStatusFilter || undefined
      );
      setStudents(sList);
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  const loadActions = async () => {
    try {
      const aList = await api.getActions(selectedBatchId || undefined);
      setActions(aList);
    } catch (err) {
      console.error('Failed to load actions:', err);
    }
  };

  const handleCreateAction = async (data: any) => {
    await api.createAction(data);
    await loadActions();
    await loadDashboardData();
  };

  const handleUpdateAction = async (id: number, data: any) => {
    await api.updateAction(id, data);
    await loadActions();
    await loadDashboardData();
  };

  const handleDeleteAction = async (id: number) => {
    await api.deleteAction(id);
    await loadActions();
    await loadDashboardData();
  };

  const handleTriggerActionFromGap = (gap: TopicGap) => {
    setQuickActionPrefill({
      batch_id: gap.batch_id,
      subject_id: gap.subject_id,
      topic_id: gap.topic_id,
      title: `${gap.topic_name} - Remedial Workshop`,
      action_type: gap.recommended_action_type,
      evidence_reason: gap.reason,
      target_student_ids: gap.impacted_student_ids || [],
    });
    setShowQuickActionModal(true);
  };

  // If user navigated to landing page view
  if (isLandingOpen) {
    return <LandingPage onEnterApp={() => setIsLandingOpen(false)} />;
  }

  const selectedBatchObj = batches.find((b) => b.id === selectedBatchId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenLanding={() => setIsLandingOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNav
          batches={batches}
          selectedBatchId={selectedBatchId}
          onSelectBatch={setSelectedBatchId}
          users={users}
          currentUser={currentUser}
          onSwitchUser={setCurrentUser}
          onQuickImport={() => setCurrentTab('import')}
          onQuickAction={() => {
            setQuickActionPrefill(null);
            setShowQuickActionModal(true);
          }}
        />

        {/* Tab Content Page */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <DashboardPage
              summary={dashboardSummary}
              topicGaps={topicGaps}
              onNavigateTab={setCurrentTab}
              selectedBatchName={selectedBatchObj?.name}
            />
          )}

          {currentTab === 'students' && (
            <StudentsPage
              students={students}
              searchQuery={studentSearch}
              setSearchQuery={setStudentSearch}
              statusFilter={studentStatusFilter}
              setStatusFilter={setStudentStatusFilter}
            />
          )}

          {currentTab === 'import' && (
            <TestImportPage
              onImportSuccess={() => {
                loadDashboardData();
                loadStudents();
                loadActions();
              }}
            />
          )}

          {currentTab === 'topics' && (
            <TopicAnalysisPage
              topicGaps={topicGaps}
              onTriggerAction={handleTriggerActionFromGap}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'actions' && (
            <ActionCentrePage
              actions={actions}
              batches={batches}
              users={users}
              currentUser={currentUser}
              onRefresh={loadActions}
              onCreateAction={handleCreateAction}
              onUpdateAction={handleUpdateAction}
              onDeleteAction={handleDeleteAction}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'interventions' && (
            <InterventionsPage selectedBatchId={selectedBatchId} />
          )}

          {currentTab === 'reports' && (
            <ReportsPage batches={batches} students={students} />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              batches={batches}
              users={users}
              institution={institution}
            />
          )}
        </main>
      </div>

      {/* Quick Action Modal Triggered from TopNav or Gap Card */}
      {showQuickActionModal && (
        <ActionModal
          initialData={quickActionPrefill}
          batches={batches}
          users={users}
          onClose={() => {
            setShowQuickActionModal(false);
            setQuickActionPrefill(null);
          }}
          onSave={async (data) => {
            await handleCreateAction(data);
            setCurrentTab('actions');
          }}
        />
      )}
    </div>
  );
}

export default App;
