import {BaseCommand} from '@adonisjs/ace'

export default class MakeUser extends BaseCommand {
  public static commandName = 'make:user'
  public static description = 'Create a new user'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run (): Promise<void> {
    const { default: User } = await import('Domains/Users/Models/User')

    const firstname = await this.prompt.ask('Enter user firstname')
    const lastname = await this.prompt.ask('Enter user lastname')
    const email = await this.prompt.ask('Choose email')
    const ine = await this.prompt.ask('Choose CODE INE')
    const password = await this.prompt.secure('Choose account password')
    const passwordConfirmation = await this.prompt.secure('Confirm account password')

    if (password !== passwordConfirmation) {
      this.logger.fatal('Passwords are not identical!')
      return
    }

    await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      ine: ine,
      password: password,
    })

    this.logger.success('User was create')
  }
}
