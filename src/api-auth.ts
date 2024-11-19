import prisma from "@/db";
import bcrypt from 'bcryptjs'

export interface ApiScope {
  [key: string]: ApiScope | boolean;
}

export async function generateApiKey(name: string, scopes: ApiScope) : Promise<{ key: string, scopes: ApiScope, name: string, createdAt: Date }> {
  const saltRounds = 10;
  const token = crypto.randomUUID();
  const hashedToken = await bcrypt.hash(token, saltRounds);
  const key = await prisma.apiKey.create({
    data: {
      key: hashedToken,
      name,
      scopes
    }
  })
  return {key: token, scopes, name, createdAt: key.createdAt}
}

export async function editPermissions(name: string, newScopes : ApiScope) {
  const record = await prisma.apiKey.findFirst({where: {name: name}})
  if (!record) throw new Error("Api Key not found")
  const apiKey = await prisma.apiKey.update({
    where: {
      name
    },
    data: {
      scopes: newScopes
    }
  });
  return {name: apiKey.name, scopes: apiKey.scopes, createdAt: apiKey.createdAt}
}

export async function deleteApiKey(name: string) {
  if(!(await prisma.apiKey.delete({
    where: {
      name
    }
  }))) throw new Error("Api Key not found")
}

export async function getPermissions(name: string) : Promise<ApiScope> {
  const key = await prisma.apiKey.findFirst({where: {name}});
  if (!key) throw new Error("Api Key not found")
  return key.scopes as ApiScope;
}

export async function getCreatedAt(name: string) : Promise<Date> {
  const key = await prisma.apiKey.findFirst({where: {name}});
  if (!key) throw new Error("Api Key not found")
  return key.createdAt;
}

export async function getKeys() : Promise<string[]> {
  return (await prisma.apiKey.findMany()).map((e) => e.name);
}

export async function checkAccess(token: string, neededPermission : string) : Promise<boolean> {
  const keys = await prisma.apiKey.findMany()
  for (const key of keys) {
    if (await bcrypt.compare(token, key.key)) {
      return hasPermission(key.scopes as ApiScope, neededPermission)
    }
  }
  throw new Error("Api Key not found")
}

export function hasPermission(scope: ApiScope, permission: string): boolean {
  const parts = permission.split('.');
  let currentScope: ApiScope | boolean = scope;
  for (const part of parts) {
    if (typeof currentScope === 'boolean') {
      return currentScope;
    }
    if (currentScope[part] === undefined) {
      return false;
    }
    currentScope = currentScope[part];
  }
  return currentScope === true;
}

const roles = ['USER', 'MEMBER', 'WHITELISTER', 'DESIGNER', 'DEVELOPER', 'MAINTAINER']

export function isWhitelisterOrMore(role: string) {
  return roles.indexOf(role) >= roles.indexOf('WHITELISTER')
}

export function isDesignerOrMore(role: string) {
  return roles.indexOf(role) >= roles.indexOf('DESIGNER')
}

export function isDeveloperOrMore(role: string) {
  return roles.indexOf(role) >= roles.indexOf('DEVELOPER')
}

export function isMaintainer(role: string) {
  return roles.indexOf(role) >= roles.indexOf('MAINTAINER')
}