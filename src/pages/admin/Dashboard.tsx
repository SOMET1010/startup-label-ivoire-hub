import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Star, BarChart3, Settings, FileText, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtimeAdminStats } from "@/hooks/useRealtimeAdminStats";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import EnhancedKPICards from "@/components/admin/EnhancedKPICards";
import DashboardOverview from "@/components/admin/DashboardOverview";
import EvaluationList from "@/components/evaluation/EvaluationList";
import VotingStatsDashboard from "@/components/admin/VotingStatsDashboard";
import AdminPlatformSettings from "@/components/admin/AdminPlatformSettings";
import AdminLegalDocuments from "@/components/admin/AdminLegalDocuments";
import AdminCommitteeMembers from "@/components/admin/AdminCommitteeMembers";
import ApplicationsTab from "@/components/admin/ApplicationsTab";
import UsersTab from "@/components/admin/UsersTab";
import ApplicationDetailDialog from "@/components/admin/ApplicationDetailDialog";
import AdminDialogs from "@/components/admin/AdminDialogs";

export default function AdminDashboard() {
  const { user, profile, isAdmin } = useAuth();
  const { metrics: realtimeMetrics, animationKey } = useRealtimeAdminStats();
  const admin = useAdminDashboard();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin</h1>
              <p className="text-muted-foreground">Vue d'ensemble de la plateforme de labellisation.</p>
            </div>
            <Button variant="outline" onClick={admin.fetchData} disabled={admin.loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${admin.loading ? "animate-spin" : ""}`} />Actualiser
            </Button>
          </div>

          {/* KPI Cards */}
          {realtimeMetrics ? (
            <EnhancedKPICards metrics={realtimeMetrics} usersCount={admin.stats.users} animationKey={animationKey} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse"><CardContent className="p-3"><div className="h-4 bg-muted rounded w-16 mb-2" /><div className="h-6 bg-muted rounded w-10" /></CardContent></Card>
              ))}
            </div>
          )}

          {/* Overview Charts */}
          {realtimeMetrics && (
            <div className="my-8">
              <DashboardOverview monthlyStats={realtimeMetrics.monthlyStats} statusCounts={realtimeMetrics.statusCounts} sectorBreakdown={realtimeMetrics.sectorBreakdown} animationKey={animationKey} />
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="applications" className="space-y-4">
            <TabsList className="flex-wrap">
              <TabsTrigger value="applications">Candidatures</TabsTrigger>
              <TabsTrigger value="evaluations" className="flex items-center gap-1"><Star className="h-4 w-4" />Évaluations</TabsTrigger>
              <TabsTrigger value="statistiques" className="flex items-center gap-1"><BarChart3 className="h-4 w-4" />Statistiques</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs & Rôles</TabsTrigger>
              {isAdmin && (
                <>
                  <TabsTrigger value="settings" className="flex items-center gap-1"><Settings className="h-4 w-4" />Paramètres</TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-1"><FileText className="h-4 w-4" />Documents</TabsTrigger>
                  <TabsTrigger value="comite" className="flex items-center gap-1"><Users className="h-4 w-4" />Comité</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="applications">
              <ApplicationsTab
                applications={admin.applications} filteredApplications={admin.filteredApplications} loading={admin.loading}
                searchQuery={admin.searchQuery} onSearchChange={admin.setSearchQuery}
                statusFilter={admin.statusFilter} onStatusChange={admin.setStatusFilter}
                sectorFilter={admin.sectorFilter} onSectorChange={admin.setSectorFilter}
                dateFilter={admin.dateFilter} onDateChange={admin.setDateFilter}
                minScoreFilter={admin.minScoreFilter} onMinScoreChange={admin.setMinScoreFilter}
                pendingDocsOnly={admin.pendingDocsOnly} onPendingDocsChange={admin.setPendingDocsOnly}
                onReset={admin.resetFilters} getScoreBadge={admin.getScoreBadge}
                openDetailsDialog={admin.openDetailsDialog} openActionDialog={admin.openActionDialog}
                openDocumentRequestDialog={admin.openDocumentRequestDialog}
              />
            </TabsContent>

            <TabsContent value="evaluations">
              {user && <EvaluationList currentUserId={user.id} currentUserName={profile?.full_name || profile?.email || undefined} />}
            </TabsContent>

            <TabsContent value="statistiques"><VotingStatsDashboard /></TabsContent>

            <TabsContent value="users">
              <UsersTab users={admin.users} loading={admin.loading} openRoleDialog={admin.openRoleDialog} />
            </TabsContent>

            {isAdmin && (
              <>
                <TabsContent value="settings"><AdminPlatformSettings /></TabsContent>
                <TabsContent value="documents"><AdminLegalDocuments /></TabsContent>
                <TabsContent value="comite"><AdminCommitteeMembers /></TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>

      {/* Dialogs */}
      <ApplicationDetailDialog
        open={admin.showDetailsDialog} onOpenChange={admin.setShowDetailsDialog}
        selectedApplication={admin.selectedApplication}
        documentRequests={admin.documentRequests} loadingDocRequests={admin.loadingDocRequests}
        markingFulfilledId={admin.markingFulfilledId} cancellingRequestId={admin.cancellingRequestId}
        onMarkAsFulfilled={admin.handleMarkAsFulfilled}
        onCancelRequest={(req) => { admin.setRequestToCancel(req); admin.setShowCancelDialog(true); }}
        onDecisionApplied={() => { admin.fetchData(); admin.setShowDetailsDialog(false); }}
      />

      <AdminDialogs
        showActionDialog={admin.showActionDialog} setShowActionDialog={admin.setShowActionDialog}
        actionType={admin.actionType} actionNotes={admin.actionNotes} setActionNotes={admin.setActionNotes}
        actionLoading={admin.actionLoading} selectedApplication={admin.selectedApplication}
        handleStatusChange={admin.handleStatusChange}
        showRoleDialog={admin.showRoleDialog} setShowRoleDialog={admin.setShowRoleDialog}
        selectedUser={admin.selectedUser} newRole={admin.newRole} setNewRole={admin.setNewRole}
        handleRoleChange={admin.handleRoleChange}
        showDocumentRequestDialog={admin.showDocumentRequestDialog} setShowDocumentRequestDialog={admin.setShowDocumentRequestDialog}
        adminUserId={user?.id || ""} fetchData={admin.fetchData} setSelectedApplication={admin.setSelectedApplication}
        showCancelDialog={admin.showCancelDialog} setShowCancelDialog={admin.setShowCancelDialog}
        requestToCancel={admin.requestToCancel} cancellingRequestId={admin.cancellingRequestId}
        handleCancelDocumentRequest={admin.handleCancelDocumentRequest}
      />

      <Footer />
    </div>
  );
}
