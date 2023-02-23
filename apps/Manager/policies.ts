export default {
  EtiquettePolicy: () => import('App/Manager/Policies/EtiquettePolicy'),
  QuestionPolicy: () => import('App/Manager/Policies/QuestionPolicy'),
  SequencePolicy: () => import('App/Manager/Policies/SequencePolicy'),
  SessionPolicy: () => import('App/Manager/Policies/SessionPolicy')
}
