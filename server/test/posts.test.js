const crypto = require("crypto");
const axios = require("axios");
const postsService = require("../service/postsService.js");

const generate = function () {
  return crypto.randomBytes(20).toString("hex");
};

const request = function (url, method, data) {
  return axios({ url, method, data });
};

test("Should get posts", async function () {
  // given
  const post1 = await postsService.savePost({ title: generate(), content: generate() });
  const post2 = await postsService.savePost({ title: generate(), content: generate() });
  const post3 = await postsService.savePost({ title: generate(), content: generate() });

  // when
  const response = await request("http://localhost:3000/posts", "get");
  const posts = response.data;

  // then
  expect(posts).toHaveLength(3);

  await postsService.deletePost(post1.id);
  await postsService.deletePost(post2.id);
  await postsService.deletePost(post3.id);
});

test("Should save post", async function () {
  // given
  const data = { title: generate(), content: generate() };

  // when
  const response = await request("http://localhost:3000/posts", "post", data);

  const post = response.data;

  // then
  expect(post.title).toBe(data.title);
  expect(post.content).toBe(data.content);

  await postsService.deletePost(post.id);
});

test.only("Should update post", async function () {
  // given
  const post = await postsService.savePost({ title: generate(), content: generate() });
  post.title = generate();
  post.content = "iupdate";

  // when
  await request(`http://localhost:3000/posts/${post.id}`, "put", post);
  const updatedPost = await postsService.getPost(post.id);

  // then
  expect(updatedPost.title).toBe(post.title);
  expect(updatedPost.content).toBe(post.content);

  await postsService.deletePost(updatedPost.id);
});
