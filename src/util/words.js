import keywordExtraxtor from "keyword-extractor";

export const checkIfContains = (words, testString) => {
  const regex = new RegExp(words.join("|"));
  return regex.test(testString);
};

export const getContainedWords = (words, testString) => {
  const keywords = keywordExtraxtor.extract(testString, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: false,
  });

  const wordSet = new Set(words);
  const checkedWords = new Set(keywords);
  return [...intersection(wordSet, checkedWords)];
};

function intersection(setA, setB) {
  let _intersection = new Set();
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}
