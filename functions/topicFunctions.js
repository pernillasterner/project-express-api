// Function to extract param
export const extractParam = (req, param) => {
  return req.params[param];
};

// Function to extract all topic names
export const extractTopicNames = (topics) => topics.map((topic) => topic.name);

// Function to find a topic name
export const findTopicByName = (topics, topicName) => {
  return topics.find((topic) => topic.name === topicName);
};

// Function to find topic with specified name
export const findSubTopics = (topics, topicName) => {
  const topic = topics.find((topic) => topic.name === topicName);

  // If topic is found then return it´s subtopic, if not return null
  return topic ? topic.subtopics : null;
};

export const findTopicsByKeyword = (topics, querySearch) => {
  return topics.filter((topic) =>
    topic.name.toLowerCase().includes(querySearch.toLowerCase())
  );
};

export const findQuestionsByLevel = (topics, level) => {
  // Create an array to store questions
  let questions = [];
  const limit = 4;

  // Loop through each topic
  topics.forEach((topic) => {
    // Loop through each subtopic
    topic.subtopics.forEach((subtopic) => {
      // Filter questions based on the level
      const filteredQuestions = subtopic.questions.filter(
        (question) => question.level === level
      );
      // Add filtered questions to the array
      questions = questions.concat(filteredQuestions);
    });
  });

  return questions.slice(0, limit);
};
