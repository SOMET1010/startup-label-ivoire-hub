import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Shield } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { type UserWithRole } from "@/hooks/useAdminDashboard";

interface UsersTabProps {
  users: UserWithRole[];
  loading: boolean;
  openRoleDialog: (user: UserWithRole) => void;
}

export default function UsersTab({ users, loading, openRoleDialog }: UsersTabProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Gestion des utilisateurs et rôles</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : users.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucun utilisateur pour le moment.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôles</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name || "-"}</TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length > 0 ? user.roles.map((role) => <Badge key={role} variant="outline">{role}</Badge>) : <span className="text-muted-foreground text-sm">Aucun rôle</span>}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(user.created_at), "dd MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openRoleDialog(user)}>
                      <Shield className="h-4 w-4 mr-1" />Gérer rôles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
