export default {
  EtiquettePolicy: () => import('App/Manager/Policies/EtiquettePolicy'),
  QuestionPolicy: () => import('App/Manager/Policies/QuestionPolicy'),
  SequencePolicy: () => import('App/Manager/Policies/SequencePolicy'),
  SessionPolicy: () => import('App/Manager/Policies/SessionPolicy'),
  PermissionPolicy: () => import('App/Manager/Policies/PermissionPolicy'),
  UserPolicy: () => import('App/Manager/Policies/UserPolicy'),
  RolePolicy: () => import('App/Manager/policies/RolePolicy')
}
