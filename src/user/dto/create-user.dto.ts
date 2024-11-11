import { Person } from "src/person/person.entity"

export class CreateUserDto{
    person: Person
    typeUser: string
}