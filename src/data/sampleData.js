/**
 * Sample study data for demo/fallback when Ollama is not available.
 */
export const sampleNotes = `# Introduction to Machine Learning

Machine Learning (ML) is a subset of Artificial Intelligence (AI) that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves.

## Types of Machine Learning

### 1. Supervised Learning
Supervised learning uses labeled training data to learn a mapping from inputs to outputs. The algorithm learns from example input-output pairs. Common algorithms include:
- Linear Regression: Used for predicting continuous values
- Decision Trees: Tree-based models for classification and regression
- Support Vector Machines (SVM): Finds optimal hyperplane for classification
- Neural Networks: Inspired by biological neural networks

### 2. Unsupervised Learning
Unsupervised learning finds hidden patterns in data without labeled responses. Key techniques:
- Clustering (K-Means, DBSCAN): Groups similar data points
- Dimensionality Reduction (PCA, t-SNE): Reduces feature space
- Association Rules: Discovers relationships between variables

### 3. Reinforcement Learning
An agent learns to make decisions by performing actions in an environment to maximize cumulative reward. Key concepts:
- Agent, Environment, State, Action, Reward
- Exploration vs Exploitation trade-off
- Q-Learning and Policy Gradient methods

## Key Concepts

### Overfitting vs Underfitting
- Overfitting: Model learns training data too well, including noise. High variance, low bias.
- Underfitting: Model is too simple to capture underlying patterns. High bias, low variance.
- The bias-variance tradeoff is central to model selection.

### Feature Engineering
The process of using domain knowledge to create features that make ML algorithms work better. Includes:
- Feature Selection: Choosing relevant features
- Feature Extraction: Creating new features from existing ones
- Normalization/Standardization: Scaling features to comparable ranges

### Model Evaluation Metrics
- Accuracy: Proportion of correct predictions
- Precision: True positives / (True positives + False positives)
- Recall: True positives / (True positives + False negatives)
- F1 Score: Harmonic mean of precision and recall
- AUC-ROC: Area under the Receiver Operating Characteristic curve
`;

export const sampleStudyData = {
  title: "Machine Learning Fundamentals",
  summary: "A comprehensive overview of machine learning covering supervised, unsupervised, and reinforcement learning paradigms, along with key concepts like overfitting, feature engineering, and model evaluation metrics.",
  mcqs: [
    {
      question: "Which type of machine learning uses labeled training data to learn mappings from inputs to outputs?",
      options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Semi-supervised Learning"],
      correct_answer_index: 1,
      explanation: "Supervised learning uses labeled data (input-output pairs) to train models. The 'supervision' comes from the known correct outputs in the training data.",
      hint: "Think about which approach needs 'examples with answers' to learn from."
    },
    {
      question: "What is overfitting in the context of machine learning?",
      options: [
        "When a model is too simple to capture patterns",
        "When a model performs poorly on training data",
        "When a model learns training data too well, including noise",
        "When a model has high bias and low variance"
      ],
      correct_answer_index: 2,
      explanation: "Overfitting occurs when a model memorizes the training data including its noise, resulting in poor generalization to new data. It's characterized by high variance and low bias.",
      hint: "Consider what happens when a model 'memorizes' rather than 'learns'."
    },
    {
      question: "Which algorithm is primarily used for finding groups of similar data points?",
      options: ["Linear Regression", "K-Means Clustering", "Support Vector Machine", "Decision Trees"],
      correct_answer_index: 1,
      explanation: "K-Means is an unsupervised clustering algorithm that partitions data into K groups by minimizing the distance between data points and their assigned cluster centroids.",
      hint: "This is an unsupervised learning technique that groups things together."
    },
    {
      question: "What does the F1 Score measure?",
      options: [
        "The proportion of correct predictions",
        "The area under the ROC curve",
        "The harmonic mean of precision and recall",
        "The trade-off between bias and variance"
      ],
      correct_answer_index: 2,
      explanation: "The F1 Score is the harmonic mean of precision and recall, providing a single metric that balances both. It's especially useful when you need to find an optimal balance between precision and recall.",
      hint: "It combines two other metrics into one balanced score."
    },
    {
      question: "In reinforcement learning, what is the 'exploration vs exploitation' trade-off?",
      options: [
        "Choosing between supervised and unsupervised approaches",
        "Balancing between trying new actions and using known good actions",
        "Deciding between overfitting and underfitting",
        "Selecting between feature selection and feature extraction"
      ],
      correct_answer_index: 1,
      explanation: "The exploration-exploitation trade-off is about balancing the desire to try new, potentially better actions (exploration) with the desire to use actions known to give good rewards (exploitation).",
      hint: "Should the agent try something new or stick with what works?"
    }
  ],
  flashcards: [
    {
      concept: "Supervised Learning",
      definition: "A type of machine learning where the algorithm learns from labeled training data, mapping inputs to known outputs. Examples include classification and regression tasks.",
      key_takeaway: "Requires labeled data — the algorithm learns from examples with known correct answers."
    },
    {
      concept: "Overfitting",
      definition: "When a model learns the training data too well, capturing noise and random fluctuations rather than the underlying pattern. This results in poor generalization to new, unseen data.",
      key_takeaway: "High variance, low bias — the model is too complex for the available data."
    },
    {
      concept: "Feature Engineering",
      definition: "The process of using domain knowledge to select, extract, and transform raw data into features that better represent the underlying problem for predictive models.",
      key_takeaway: "Good features can be more important than choosing the right algorithm."
    },
    {
      concept: "Precision vs Recall",
      definition: "Precision measures the proportion of positive identifications that are actually correct (TP / (TP + FP)). Recall measures the proportion of actual positives that are identified correctly (TP / (TP + FN)).",
      key_takeaway: "There's often a trade-off: increasing one tends to decrease the other."
    },
    {
      concept: "Reinforcement Learning",
      definition: "A learning paradigm where an agent learns optimal behavior by interacting with an environment, receiving rewards or penalties for its actions, and maximizing cumulative reward over time.",
      key_takeaway: "The agent learns through trial and error — no labeled data needed, just a reward signal."
    }
  ],
  viva_questions: [
    {
      question: "Explain the bias-variance tradeoff and how it relates to model complexity in machine learning.",
      ideal_answer: "The bias-variance tradeoff is a fundamental concept where bias refers to errors from oversimplified assumptions (underfitting), and variance refers to sensitivity to training data fluctuations (overfitting). Simple models have high bias but low variance, while complex models have low bias but high variance. The goal is to find the optimal complexity that minimizes total error (bias² + variance + irreducible error). Techniques like cross-validation, regularization, and ensemble methods help navigate this tradeoff.",
      follow_up_hint: "Consider how regularization techniques like L1/L2 help control this tradeoff."
    },
    {
      question: "Compare and contrast K-Means clustering with DBSCAN. When would you choose one over the other?",
      ideal_answer: "K-Means partitions data into K predefined clusters by minimizing within-cluster distances to centroids. It assumes spherical clusters of similar size and requires specifying K beforehand. DBSCAN (Density-Based Spatial Clustering) finds clusters of arbitrary shape by grouping densely connected points. It doesn't require specifying the number of clusters and can identify noise/outliers. Choose K-Means for well-separated, spherical clusters when you know K. Choose DBSCAN when clusters have irregular shapes, you don't know the number of clusters, or you need to handle outliers.",
      follow_up_hint: "Think about how each algorithm handles noise and outliers differently."
    },
    {
      question: "What is the difference between feature selection and feature extraction? Provide examples of each.",
      ideal_answer: "Feature selection involves choosing a subset of existing features that are most relevant to the prediction task, discarding irrelevant or redundant ones. Examples include correlation-based filtering, recursive feature elimination, and LASSO regularization. Feature extraction creates new features from existing ones, often reducing dimensionality. Examples include PCA (Principal Component Analysis), which creates linear combinations of features, and creating polynomial features or interaction terms. Feature selection preserves interpretability since original features are kept, while feature extraction may create less interpretable but more informative representations.",
      follow_up_hint: "Consider how PCA creates new features and why the resulting components might be harder to interpret."
    }
  ]
};
