const { test, after, describe, beforeEach } = require("node:test");
const assert = require("node:assert");

const mongoose = require("mongoose");
const helper = require("./test_helper");

const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const bcrypt = require("bcrypt");

const User = require("../models/user");

describe("when there is initially one user in db", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash("ashley!", 10); // saltRounds = 10
        const user = new User({
            username: "root",
            passwordHash,
        });
        await user.save();
    });

    test("creation success with a fresh username", async () => {
        const usersAtStart = await helper.usersInDb();
        const newUser = {
            username: "Skiym",
            password: "ohmygod",
            name: "Hatdog",
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length);

        const usernames = usersAtEnd.map((u) => u.username);
        assert(usernames.includes("Skiym"));
    });

    describe("creating a user with invalid username", () => {
        test("creation fails with proper status code if username is less than 3 characters", async () => {
            const invalidUser = {
                username: "op",
                password: "asdfjaskfhd",
                name: "HELLOO",
            };
            await api
                .post("/api/users")
                .send(invalidUser)
                .expect(400)
                .expect("Content-Type", /application\/json/);
        });

        test("creation fails with proper status code if username is not unique", async () => {
            const newUser = {
                username: "root",
                password: "ahdhah",
                name: "idk whats wrong with the prev test :(",
            };

            await api
                .post("/api/users/")
                .send(newUser)
                .expect(400)
                .expect("Content-Type", /application\/json/);
        });
    });
    describe("creating a user with invalid password", () => {
        test("creation fails with proper status code if password is not given", async () => {
            const newUser = {
                username: "hello",
                name: "idk",
            };

            await api
                .post("/api/users")
                .send(newUser)
                .expect(400)
                .expect("Content-Type", /application\/json/);
        });

        test("creation fails with proper status code if password is too short", async () => {
            const newUser = {
                username: "hello",
                password: "jk",
                name: "idk",
            };

            await api
                .post("/api/users")
                .send(newUser)
                .expect(400)
                .expect("Content-Type", /application\/json/);
        });
    });
});

after(() => {
    mongoose.connection.close();
});
