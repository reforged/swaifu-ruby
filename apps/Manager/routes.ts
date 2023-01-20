import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login').as('auth.login')

    Route.group(() => {
      Route.get('/me', 'AuthController.me').as('auth.me')
      Route.delete('/logout', 'AuthController.logout').as('auth.logout')
    }).middleware(['auth'])
  }).prefix('authentication')

  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'EtiquettesController.index')
      Route.get('/user/:id', 'EtiquettesController.user')
      Route.get('/:id', 'EtiquettesController.show')

      Route.post('/create', 'EtiquettesController.store')
      Route.put('/:id', 'EtiquettesController.update')
      Route.delete('/:id', 'EtiquettesController.destroy')
    }).prefix('etiquettes')
  }).middleware(['auth'])
}).namespace('App/Manager/Controllers')
