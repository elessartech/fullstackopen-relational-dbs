require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Sequelize, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const schemaFilePath = path.join(__dirname, "commands.sql");

const applySchemaFromFile = async () => {
  try {
    const schema = fs.readFileSync(schemaFilePath, "utf-8");
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt);

    console.log(`Applying schema from ${schemaFilePath}...`);
    for (const statement of statements) {
      console.log(`Executing: ${statement}`);
      await sequelize.query(statement);
    }
    console.log("Schema applied successfully.");
  } catch (error) {
    console.error("Error applying schema:", error);
  }
};

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await applySchemaFromFile();
    const defaultCommand = "SELECT * FROM blogs";
    const argsProvided = process.argv.length > 2;
    const command = argsProvided
      ? process.argv.slice(2).join(" ")
      : defaultCommand;

    try {
      const blogs = await sequelize.query(command, { type: QueryTypes.SELECT });
      if (!argsProvided) {
        console.log(`Executing (default): SELECT * FROM blogs`);
      } else {
        console.log(`Executing: ${command}`);
      }
      blogs.forEach((blog) =>
        console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes`),
      );
    } catch (error) {
      console.error("Error executing query:", error);
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

main();
