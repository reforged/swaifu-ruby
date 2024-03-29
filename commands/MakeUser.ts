import {BaseCommand} from '@adonisjs/ace'
import Role from "Domains/Users/Models/Role";

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
    const numero = await this.prompt.ask('Choose student code')
    const password = await this.prompt.secure('Choose account password')
    const passwordConfirmation = await this.prompt.secure('Confirm account password')

    if (password !== passwordConfirmation) {
      this.logger.fatal('Passwords are not identical!')
      return
    }

    const user = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      numero: numero,
      password: password,
    })

    const role = await Role.findBy('label', 'Administrateur')
    if (!role) {
      this.logger.fatal('Role admin was not created')
      return
    }

    await user.related('roles').create(role)

    this.logger.success('User was create')
  }
}
