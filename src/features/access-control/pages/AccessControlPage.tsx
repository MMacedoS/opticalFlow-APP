import { useState } from "react";
import { Eye, Lock, Pencil, Plus, Trash2, UserCog } from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";

import { ProfileForm } from "../components/ProfileForm";
import { UserProfilesForm } from "../components/UserProfilesForm";
import {
  useAccessUsers,
  useDeleteProfile,
  useProfiles,
} from "../hooks/useAccess";
import {
  moduleLabel,
  type AccessProfile,
  type AccessUser,
} from "../types/access.type";

import { AlertConfirm } from "@/components/alert/AlertConfirm";
import { CardPage } from "@/components/cards/CardPage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DialogState =
  | { mode: "create-profile" }
  | { mode: "profile"; profile: AccessProfile }
  | { mode: "user"; user: AccessUser }
  | null;

function ProfilesTab({
  profiles,
  onOpen,
  onCreate,
  onDelete,
}: {
  profiles: AccessProfile[];
  onOpen: (profile: AccessProfile) => void;
  onCreate: () => void;
  onDelete: (profile: AccessProfile) => void;
}) {
  const empresa = profiles.filter((profile) => !profile.sistema);
  const sistema = profiles.filter((profile) => profile.sistema);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Monte perfis com as permissões de cada função e atribua aos usuários.
        </p>
        <Button size="sm" onClick={onCreate}>
          <Plus className="mr-2 size-4" />
          Novo perfil
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="p-3 font-medium">Perfil</th>
              <th className="p-3 font-medium">Permissões</th>
              <th className="p-3 font-medium">Usuários</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {empresa.length === 0 && (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={4}>
                  Nenhum perfil da empresa. Crie o primeiro com "Novo perfil".
                </td>
              </tr>
            )}
            {empresa.map((profile) => (
              <tr key={profile.id} className="border-t">
                <td className="p-3">
                  <span className="font-medium">{profile.nome}</span>
                  {profile.descricao && (
                    <span className="block text-xs text-muted-foreground">
                      {profile.descricao}
                    </span>
                  )}
                </td>
                <td className="p-3">{profile.permissoes.length}</td>
                <td className="p-3">{profile.usuarios}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Editar perfil"
                      onClick={() => onOpen(profile)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Excluir perfil"
                      onClick={() => onDelete(profile)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="rounded-lg border p-3">
        <summary className="cursor-pointer text-sm font-medium">
          Perfis padrão do sistema ({sistema.length}) — acesso completo a um
          módulo
        </summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {sistema.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => onOpen(profile)}
              className="flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted/50"
            >
              <span className="flex items-center gap-2">
                <Lock className="size-3.5 text-muted-foreground" />
                {moduleLabel(profile.nome)}
              </span>
              <span className="text-xs text-muted-foreground">
                {profile.usuarios} usuário(s)
              </span>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}

function UsersTab({
  users,
  profiles,
  currentUserId,
  onEdit,
}: {
  users: AccessUser[];
  profiles: AccessProfile[];
  currentUserId?: string;
  onEdit: (user: AccessUser) => void;
}) {
  const byId = new Map(profiles.map((profile) => [profile.id, profile]));

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-left">
          <tr>
            <th className="p-3 font-medium">Usuário</th>
            <th className="p-3 font-medium">Perfis</th>
            <th className="p-3" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const assigned = user.acessoIds
              .map((id) => byId.get(id))
              .filter((profile): profile is AccessProfile => Boolean(profile));
            const empresa = assigned.filter((profile) => !profile.sistema);
            const modulos = assigned.length - empresa.length;
            const isSelf = user.id === currentUserId;

            return (
              <tr key={user.id} className="border-t">
                <td className="p-3">
                  <span className="font-medium">
                    {user.pessoa?.nome ?? user.username ?? user.email}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {user.email}
                    {user.status === "inativo" && " · inativo"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {empresa.map((profile) => (
                      <span
                        key={profile.id}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                      >
                        {profile.nome}
                      </span>
                    ))}
                    {modulos > 0 && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {modulos} módulo(s) completo(s)
                      </span>
                    )}
                    {assigned.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        Sem acesso
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isSelf}
                    title={
                      isSelf
                        ? "Você não pode alterar o próprio acesso"
                        : undefined
                    }
                    onClick={() => onEdit(user)}
                  >
                    <UserCog className="mr-1 size-4" />
                    Acessos
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function AccessControlPage() {
  const session = useAuthStore((state) => state.session);
  const profiles = useProfiles();
  const users = useAccessUsers();
  const deleteMutation = useDeleteProfile();
  const [dialog, setDialog] = useState<DialogState>(null);
  const [toDelete, setToDelete] = useState<AccessProfile | null>(null);

  const profileList = profiles.data?.data ?? [];
  const userList = users.data?.data ?? [];
  const closeDialog = () => setDialog(null);

  return (
    <CardPage
      title="Permissões"
      description="Perfis de acesso e o que cada usuário pode ver e fazer."
    >
      {(profiles.isLoading || users.isLoading) && (
        <p className="text-sm">Carregando...</p>
      )}
      {(profiles.isError || users.isError) && (
        <p className="text-sm text-destructive">Erro ao carregar permissões.</p>
      )}

      <Tabs defaultValue="perfis">
        <TabsList>
          <TabsTrigger value="perfis">Perfis</TabsTrigger>
          <TabsTrigger value="usuarios">
            Usuários ({userList.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="perfis">
          <ProfilesTab
            profiles={profileList}
            onCreate={() => setDialog({ mode: "create-profile" })}
            onOpen={(profile) => setDialog({ mode: "profile", profile })}
            onDelete={setToDelete}
          />
        </TabsContent>
        <TabsContent value="usuarios">
          <UsersTab
            users={userList}
            profiles={profileList}
            currentUserId={session?.usuario?.id}
            onEdit={(user) => setDialog({ mode: "user", user })}
          />
        </TabsContent>
      </Tabs>

      <Dialog
        open={dialog !== null}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="max-h-dvh overflow-y-auto max-w-4xl!">
          {dialog?.mode === "create-profile" && (
            <>
              <DialogHeader>
                <DialogTitle>Novo perfil de acesso</DialogTitle>
              </DialogHeader>
              <ProfileForm onDone={closeDialog} />
            </>
          )}
          {dialog?.mode === "profile" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {dialog.profile.editavel ? (
                    <Pencil className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                  {dialog.profile.sistema
                    ? moduleLabel(dialog.profile.nome)
                    : dialog.profile.nome}
                </DialogTitle>
                {!dialog.profile.editavel && (
                  <DialogDescription>
                    Perfil padrão do sistema (somente leitura).
                  </DialogDescription>
                )}
              </DialogHeader>
              <ProfileForm profile={dialog.profile} onDone={closeDialog} />
            </>
          )}
          {dialog?.mode === "user" && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Acessos de {dialog.user.pessoa?.nome ?? dialog.user.username}
                </DialogTitle>
                <DialogDescription>{dialog.user.email}</DialogDescription>
              </DialogHeader>
              <UserProfilesForm
                user={dialog.user}
                profiles={profileList}
                onDone={closeDialog}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertConfirm
        title="Excluir perfil?"
        description={`O perfil "${toDelete?.nome ?? ""}" será excluído. Perfis atribuídos a usuários não podem ser excluídos.`}
        isOpen={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteMutation.mutate(toDelete.id);
          setToDelete(null);
        }}
      />
    </CardPage>
  );
}
