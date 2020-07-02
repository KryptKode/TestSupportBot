export const articlesBaseUrl = "docs/";
//articles, the keywords mapped to respective articles
const articles = {
  product: [
    {
      id: 1,
      title: "Which product packages are available",
      file: "product_1.txt",
    },
    {
      id: 2,
      title: "What product packages are available",
      file: "product_2.txt",
    },
    {
      id: 3,
      title: "Check available product packages",
      file: "product_3.txt",
    },
  ],
  payment: [
    {
      id: 33,
      title: "What payment methods are available",
      file: "payment_1.txt",
    },
  ],
  email: [
    {
      id: 32,
      title: "I do not receive emails",
      file: "email_1.txt",
    },
  ],
  receive: [
    {
      id: 36,
      title: "I do not receive emails",
      file: "receive/receive_1.txt",
    },
  ],
  forgot: [
    {
      id: 33,
      title: "I forgot my password",
      file: "password/password_1.txt",
    },
  ],
  telephone: [
    {
      id: 31,
      title: "How can I change my telephone number",
      file: "telephone/telephone_1.txt",
    },
  ],
  change: [
    {
      id: 31,
      title: "How can I change my telephone number",
      file: "telephone/telephone_1.txt",
    },
  ],
  password: [
    {
      id: 33,
      title: "How i can change my Password",
      file: "password/password_1.txt",
    },
  ],
  lost: [
    {
      id: 33,
      title: "How i can change my Password",
      file: "password/password_1.txt",
    },
  ],
  reset: [
    {
      id: 33,
      title: "How i can change my Password",
      file: "password/password_1.txt",
    },
  ],
};

export const getArticles = () => {
  return articles;
};

export const getArticleByKeyWord = (keywords) => {
  const keyWordArticles = keywords.map((word) => articles[word]);
  return [].concat.apply([], keyWordArticles);
};
