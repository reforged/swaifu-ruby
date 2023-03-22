import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login').as('auth.login')
    Route.post('/register', 'AuthController.register')

    Route.group(() => {
      Route.get('/me', 'AuthController.me').as('auth.me')
      Route.delete('/logout', 'AuthController.logout').as('auth.logout')
    }).middleware(['auth'])
  }).prefix('authentication')

  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'EtiquettesController.index')
      Route.get('/:id', 'EtiquettesController.show')

      Route.post('/create', 'EtiquettesController.store')
      Route.put('/:id', 'EtiquettesController.update')
      Route.delete('/:id', 'EtiquettesController.destroy')
    }).prefix('etiquettes')

    Route.group(() => {
      Route.get('/', 'QuestionsController.index')
      Route.get('/user/:id', 'QuestionsController.user')
      Route.get('/:id', 'QuestionsController.show')

      Route.post('/create', 'QuestionsController.store')
      Route.put('/:id', 'QuestionsController.update')
      Route.delete('/:id', 'QuestionsController.destroy')
    }).prefix('questions')

    Route.group(() => {
      Route.get('/', 'SequencesController.index')
      Route.get('/:id', 'SequencesController.show')
      Route.post('/create', 'SequencesController.store')
      Route.put('/:id', 'SequencesController.update')
      Route.delete('/:id', 'SequencesController.destroy')
    }).prefix('sequences')

    Route.group(() => {
      Route.get('/', 'SessionsController.index')
      Route.get('/:id', 'SessionsController.show')
      Route.get('/user/:id', 'SessionsController.user')
      Route.post('/create', 'SessionsController.store')
    }).prefix('sessions')

    Route.group(() => {
      Route.get('/', 'UsersController.index')
      Route.get('/:id', 'UsersController.show')
      Route.post('/create', 'UsersController.store')
      Route.post('/create-many', 'UsersController.createMany')

      Route.put('/:id', 'UsersController.update')
      Route.delete('/:id', 'UsersController.destroy')
    }).prefix('users')

    Route.group(() => {
      Route.get('/', 'RolesController.index')
      Route.get('/:id', 'RolesController.show')
      Route.post('/create', 'RolesController.store')
    }).prefix('roles')

    Route.group(() => {
      Route.get('/', 'PermissionsController.index')
      Route.get('/:id', 'PermissionsController.show')
    }).prefix('permissions')
  }).middleware(['auth'])
}).namespace('App/Manager/Controllers')
