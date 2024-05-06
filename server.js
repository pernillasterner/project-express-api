import express from "express";
import cors from "cors";
import expressListEndpoints from "express-list-endpoints";
import { topics } from "./data/topics.json";
import {
  extractParam,
  extractTopicNames,
  findTopicByName,
  findSubTopics,
  findTopicsByKeyword,
  findQuestionsByLevel,
} from "./functions/topicFunctions.js";

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

const port = process.env.PORT || 5003;
let app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// ================== ROUTES ==================

// // Start defining your routes here
app.route("/").get((req, res) => {
  const endpoints = expressListEndpoints(app);
  res.send(endpoints);
});

// Get all topics or search for topics using keyword
app.get("/topics", (req, res) => {
  // topics?topic=javascript
  const querySearch = req.query.topic;
  if (querySearch) {
    const filterTopics = findTopicsByKeyword(topics, querySearch);

    if (filterTopics.length > 0) {
      res.json(filterTopics);
    } else {
      res.status(404).json({ error: "No topics found matching the query" });
    }
  } else {
    // If no search is done display all topics
    res.json(topics);
  }
});

// Get all topic names
app.get("/topics/name", (req, res) => {
  const topicNames = extractTopicNames(topics);
  res.json(topicNames);
});

// Get a specific topic by name
// /topics/JavaScript%20basics
app.get("/topics/:name", (req, res) => {
  const topicName = extractParam(req, "name");

  // Passing topics and topics name as params
  const topic = findTopicByName(topics, topicName);

  if (topic) {
    res.json(topic);
  } else {
    res.status(404).json({ error: "Topic not found" });
  }
});

// Get all subtopics of a specific topic
// /topics/JavaScript%20basics/subtopics
app.get("/topics/:name/subtopics", (req, res) => {
  const topicName = extractParam(req, "name");
  // Passing topics and topics name as params
  const subtopics = findSubTopics(topics, topicName);

  if (subtopics) {
    res.json(subtopics);
  } else {
    res.status(404).json({ error: "Subtopics not found" });
  }
});

// Get all questions related to a specific topic
app.get("/topics/:name/questions", (req, res) => {
  const topicName = extractParam(req, "name");
  // Passing topic name as params to find topics by name
  const topic = findTopicByName(topics, topicName);

  if (topic) {
    res.json(topic);
  } else {
    res
      .status(404)
      .json({ error: "No questions related to a specific topic was found" });
  }
});

// Get all topics or questions with a specific difficulty level
app.get("/topics/subtopics/:level/questions", (req, res) => {
  const level = extractParam(req, "level");

  const questions = findQuestionsByLevel(topics, level);
  res.json(questions);
});

// TODO:
// Get all topics or questions sorted by difficulty
// Get all topics with a specific tag
// Get all questions with a specific tag

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
