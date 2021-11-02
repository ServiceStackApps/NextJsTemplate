import { useEffect } from "react";
import Router from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { client } from "./gateway";
import { Authenticate, AuthenticateResponse } from "./dtos";

const KEY = "/api/Authenticate"
const FORBIDDEN_PATH = "/forbidden"

type Props = {
    redirectTo?: string,
    ifAuthenticatedRedirectTo?: string,
    requiredRole?: string,
    requiredPermission?: string,
}
export default function useAuth({ 
  redirectTo, 
  ifAuthenticatedRedirectTo,
  requiredRole,
  requiredPermission,
}: Props = {}) {
  const { data, mutate, error } = useSWR(KEY, key => client.post(new Authenticate()))
  const { cache } = useSWRConfig();
  let auth = data as AuthenticateResponse
  const loading = auth === undefined && error === undefined
  let attrs:string[] = []
  if (!loading && auth) {
    (auth.roles || []).forEach(role => attrs.push(`role:${role}`));
    (auth.permissions || []).forEach(perm => attrs.push(`perm:${perm}`));
  }

  async function signout(redirectTo?:string) {
    if (redirectTo) {
      Router.push(redirectTo)
    }
    await client.post(new Authenticate({ provider: 'logout' }));
    (cache as any).delete(KEY);
    mutate(undefined, true);    // revalidate
  }
  
  function handleAuth() {
    if (loading) return
    if (!auth && redirectTo) {
      Router.push(redirectTo) 
    } else if (auth && ifAuthenticatedRedirectTo) {
      Router.push(ifAuthenticatedRedirectTo) 
    } else if (requiredRole && (auth?.roles || []).indexOf(requiredRole) == -1) {
      Router.push(FORBIDDEN_PATH) 
    } else if (requiredPermission && (auth?.permissions || []).indexOf(requiredPermission) == -1) {
      Router.push(FORBIDDEN_PATH) 
    }
  }
  useEffect(handleAuth, [auth, loading])

  return { auth, attrs, loading, signout }
}