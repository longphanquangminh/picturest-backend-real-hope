export default {
  swagger: "2.0",
  info: {
    version: "1.0.0",
    title: "Capstone API",
    description: "API for Capstone project – Long Phan",
  },
  basePath: "/",
  tags: [
    { name: "Authentication", description: "Endpoints related to user authentication" },
    { name: "Users", description: "Endpoints related to user management" },
    { name: "Pictures", description: "Endpoints related to pictures" },
    { name: "Comments", description: "Endpoints related to comments on pictures" },
    { name: "Saving", description: "Endpoints related to saving" },
  ],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        consumes: ["application/json"],
        parameters: [
          {
            name: "body",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                },
                hoTen: { type: "string" },
                tuoi: { type: "number" },
                matKhau: {
                  type: "string",
                  minLength: 6,
                },
              },
              required: ["email", "hoTen", "tuoi", "matKhau"],
            },
          },
        ],
        responses: { 200: { description: "Success" } },
        tags: ["Authentication"],
      },
    },
    "/auth/login": {
      post: {
        summary: "User login",
        consumes: ["application/json"],
        parameters: [
          {
            name: "body",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                },
                matKhau: {
                  type: "string",
                  minLength: 6,
                },
              },
              required: ["email", "matKhau"],
            },
          },
        ],
        responses: { 200: { description: "Success" } },
        tags: ["Authentication"],
      },
    },
    "/pictures": {
      get: {
        summary: "Get all pictures",
        responses: { 200: { description: "Success" } },
        tags: ["Pictures"],
      },
      post: {
        summary: "Upload a picture",
        consumes: ["multipart/form-data"],
        parameters: [
          { name: "token", in: "header", required: true, type: "string" },
          { name: "file", in: "formData", required: true, type: "file" },
          { name: "moTa", in: "formData", required: true, type: "string" },
          { name: "tenHinh", in: "formData", required: true, type: "string" },
        ],
        responses: { 200: { description: "Success" } },
        tags: ["Pictures"],
      },
    },
    "/pictures/search-by-name/{name}": {
      get: {
        summary: "Search pictures by name",
        parameters: [{ name: "name", in: "path", type: "string", required: true }],
        responses: { 200: { description: "Success" } },
        tags: ["Pictures"],
      },
    },
    "/pictures/{id}": {
      get: {
        summary: "Get picture by ID",
        parameters: [{ name: "id", in: "path", type: "string", required: true }],
        responses: { 200: { description: "Success" } },
        tags: ["Pictures"],
      },
      delete: {
        summary: "Delete picture by ID",
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
          { name: "token", in: "header", required: true, type: "string" },
        ],
        responses: { 200: { description: "Success" } },
        tags: ["Pictures"],
      },
    },
    "/comments/{id}": {
      get: {
        summary: "Get comments for a picture",
        parameters: [{ name: "id", in: "path", type: "string", required: true }],
        responses: { 200: { description: "Success" } },
        tags: ["Comments"],
      },
      post: {
        summary: "Add a comment to a picture",
        consumes: ["application/json"],
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
          { name: "token", in: "header", required: true, type: "string" },
          {
            name: "body",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                noiDung: { type: "string" },
              },
              required: ["noiDung"],
            },
          },
        ],
        responses: { 200: { description: "Success" } },
        tags: ["Comments"],
      },
    },
    "/saved/{id}": {
      get: {
        summary: "Determine whether the user has saved a picture or not",
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
          { name: "token", in: "header", required: true, type: "string" },
        ],
        responses: { 200: { description: "Success" } },
        tags: ["Saving"],
      },
      post: {
        summary: "Save a picture for a user",
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
          { name: "token", in: "header", required: true, type: "string" },
        ],
        responses: { 200: { description: "Success" } },
        tags: ["Saving"],
      },
    },
    "/users/{id}": {
      get: {
        summary: "Get user by ID",
        parameters: [{ name: "id", in: "path", required: true, type: "string" }],
        responses: { 200: { description: "Success" } },
        tags: ["Users"],
      },
      put: {
        summary: "Update user information",
        consumes: ["application/json"],
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
          { name: "token", in: "header", type: "string", required: true },
          {
            name: "body",
            in: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
                hoTen: { type: "string" },
                tuoi: { type: "number" },
                matKhau: { type: "string" },
              },
              required: ["email", "hoTen", "tuoi", "matKhau"],
            },
          },
        ],
        responses: { 200: { description: "Success" } },
        tags: ["Users"],
      },
    },
    "/saved/saved-by-user/{userId}": {
      get: {
        summary: "Get pictures saved by user ID",
        parameters: [{ name: "userId", in: "path", required: true, type: "string" }],
        responses: { 200: { description: "Success" } },
        tags: ["Saving"],
      },
    },
    "/pictures/created-by-user/{userId}": {
      get: {
        summary: "Get pictures created by user ID",
        parameters: [{ name: "userId", in: "path", required: true, type: "string" }],
        responses: { 200: { description: "Success" } },
        tags: ["Pictures"],
      },
    },
    "/users/avatar/{id}": {
      post: {
        summary: "Upload user avatar",
        consumes: ["multipart/form-data"],
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
          { name: "token", in: "header", required: true, type: "string" },
          { name: "file", in: "formData", required: true, type: "file" },
        ],
        responses: { 200: { description: "Success" } },
        tags: ["Users"],
      },
    },
  },
};
