import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login').as('auth.login')

    Route.group(() => {
      Route.get('/me', 'AuthController.me').as('auth.me')
      Route.delete('/logout', 'AuthController.logout').as('auth.logout')
    }).middleware(['auth'])
  }).prefix('authentication')
}).namespace('App/Manager/Controllers')
