require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const main = async () => {
    try {
        await sequelize.authenticate()
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
    const defaultCommand = "SELECT * FROM blogs"
    const argsProvided = process.argv.length > 2
    const command = argsProvided ? process.argv.slice(2, process.argv.length).join(' ') : defaultCommand
    const blogs = await sequelize.query(command, { type: QueryTypes.SELECT })
    if (!argsProvided) {
        console.log(`Executing (default): SELECT * FROM blogs`)
    } else {
        console.log(`Executing: ${command}`)
    }
    blogs.forEach(blog => console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes`))
    sequelize.close()
}

main()