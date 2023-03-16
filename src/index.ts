import { buildSchema } from "graphql";
import express from "express"
import { graphqlHTTP } from "express-graphql";

const users = [
    { id: 1, name: "Jogn Doe", email: "johgnoe@gmail.com" },
    { id: 2, name: "Jogn Doe2", email: "johgnoe2@gmail.com" },
    { id: 3, name: "Jogn Doe3", email: "johgnoe3@gmail.com" },
]

const schema = buildSchema(`
    input UserInput {
        email: String!
        name: String!
    }

    type User {
        id: Int!
        name: String!
        email: String!
    }

    type Mutation {
        createUser(input: UserInput): User
        updateUser(id: Int!, input: UserInput): User
    }

    type Query {
        getUser(id: Int): User
        getUsers: [User]
    }
`)

type User = {
    id: number
    name: string
    email: string
}

type UserInput = Pick<User, "email" | "name">

const getUser = (id: number): User | undefined =>
    users.find(u => u.id === id)

const getUsers = (): User[] => users

const createUser = (input: UserInput): User => {
    const user = {
        id: users.length + 1,
        ...input,
    }

    users.push(user)

    return user
}

const updateUser = (user: User): User => {
    const index = users.findIndex(u => u.id === user.id)
    const targetUser = users[index]

    if (targetUser) users[index] = user

    return targetUser
}

const root = {
    getUser,
    getUsers,
    createUser,
    updateUser,
}

const app = express()

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
)

const PORT = 3000

app.listen(PORT, () => console.log(`Runnuin `))
