const completionRequestService = require("../services/completionRequestService");

const getCompletionRequests = async (req, res) => {
  const filters = {
    status: req.query.status,
    // Add more filters if needed
  };

  const completionRequests = await completionRequestService.getAllCompletionRequests(filters);
  res.json(completionRequests);
};

module.exports = {
  getCompletionRequests,
};
