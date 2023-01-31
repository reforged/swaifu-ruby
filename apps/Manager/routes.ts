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
  })
}).namespace('App/Manager/Controllers')
