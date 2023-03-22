import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
  }

  public async ready () {
    if (this.app.environment === 'web') {
      const Socket = (await import('../start/socket')).default
      await new Socket().register()
      console.log('Socket is ready')
    }
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
