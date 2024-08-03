const { test, describe, beforeEach } = require("node:test");
const assert = require("node:assert");

const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
    const blogs = [];
    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
});

describe("total likes", () => {
    test("of an empty blog list", () => {
        const result = listHelper.totalLikes([]);
        assert.strictEqual(result, 0);
    });

    test("of a list with one blog", () => {
        const result = listHelper.totalLikes([
            {
                likes: 5,
            },
        ]);
        assert.strictEqual(result, 5);
    });

    test("of a list with multiple blogs", () => {
        const blogs = [{ likes: 3 }, { likes: 4 }, { likes: 7 }];
        const result = listHelper.totalLikes(blogs);
        assert.strictEqual(result, 14);
    });
});

describe("favorite blog", () => {
    test("of an empty blog list", () => {
        const result = listHelper.favoriteBlog([]);
        assert.strictEqual(result, "No blogs found");
    });

    test("of a list with one blog", () => {
        const result = listHelper.favoriteBlog([
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12,
            },
        ]);
        assert.deepStrictEqual(result, {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12,
        });
    });
    test("of a list with multiple blogs", () => {
        const result = listHelper.favoriteBlog([
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12,
            },
            {
                title: "LMAFOAOO",
                author: "Edsger W. Fllyed",
                likes: 4,
            },
            {
                title: "LOOLOLOSD",
                author: "Edsger W. Warsahll",
                likes: 17,
            },
        ]);
        assert.deepStrictEqual(result, {
            title: "LOOLOLOSD",
            author: "Edsger W. Warsahll",
            likes: 17,
        });
    });
});

describe("author with most blogs", () => {
    test("of an empty blog list", () => {
        const result = listHelper.mostBlogs([]);
        assert.strictEqual(result, "No blogs found");
    });
    test("of a list with one blog", () => {
        const result = listHelper.mostBlogs([
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12,
            },
        ]);
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            blogs: 1,
        });
    });
    test("of a list with multiple blogs", () => {
        const result = listHelper.mostBlogs([
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12,
            },
            {
                title: "LMAFOAOO",
                author: "Edsger W. Fllyed",
                likes: 4,
            },
            {
                title: "LOOLOLOSD",
                author: "Edsger W. Warsahll",
                likes: 17,
            },
            {
                title: "Canonical number reduction",
                author: "Edsger W. Dijkstra",
                likes: 1,
            },
            {
                title: "ASDASDASDASD",
                author: "Edsger W. Fllyed",
                likes: 13,
            },
            {
                title: "Canonical list reduction",
                author: "Edsger W. Dijkstra",
                likes: 5,
            },
        ]);
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            blogs: 3,
        });
    });
});

describe("author with most likes", () => {
    test("of an empty blog list", () => {
        const result = listHelper.mostLikes([]);
        assert.strictEqual(result, "No blogs found");
    });
    test("of a list with one blog", () => {
        const result = listHelper.mostLikes([
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12,
            },
        ]);
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            likes: 12,
        });
    });
    test("of a list with multiple blogs", () => {
        const result = listHelper.mostLikes([
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12,
            },
            {
                title: "LMAFOAOO",
                author: "Edsger W. Fllyed",
                likes: 7,
            },
            {
                title: "LOOLOLOSD",
                author: "Edsger W. Warsahll",
                likes: 17,
            },
            {
                title: "Canonical number reduction",
                author: "Edsger W. Dijkstra",
                likes: 1,
            },
            {
                title: "ASDASDASDASD",
                author: "Edsger W. Fllyed",
                likes: 13,
            },
            {
                title: "Canonical list reduction",
                author: "Edsger W. Dijkstra",
                likes: 5,
            },
        ]);
        assert.deepStrictEqual(result, {
            author: "Edsger W. Fllyed",
            likes: 20,
        });
    });
});
