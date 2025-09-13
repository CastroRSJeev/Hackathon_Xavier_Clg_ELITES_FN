const AIStudyAssistantCard = ({ onOpenAI }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center cursor-pointer transition transform hover:-translate-y-1 hover:shadow-2xl"
      onClick={onOpenAI}
    >
      <div className="text-5xl mb-4">🤖</div>
      <h2 className="text-2xl font-semibold mb-2">AI Study Assistant</h2>
      <p className="text-gray-700 mb-6">
        Click here to get smart answers for your study questions.
      </p>
      <button className="bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md font-medium transition hover:bg-blue-800">
        Open AI Assistant
      </button>
    </div>
  );
};

export default AIStudyAssistantCard;
