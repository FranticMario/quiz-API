import { IQuiz } from "./interfaces/IQuiz";



const languageRadios = document.getElementsByName("language") as NodeListOf<HTMLInputElement>;
const difficultyRadios = document.getElementsByName("difficulty") as NodeListOf<HTMLInputElement>;
const BASE_URL = "https://vz-wd-24-01.github.io/typescript-quiz/questions/";
const labelEasy = document.getElementById("label-easy") as HTMLInputElement;
const labelHard = document.getElementById("label-hard") as HTMLInputElement;
const questionContainer = document.getElementById("question-box") as HTMLDivElement;
const answerCollection = document.getElementsByName("answer") as NodeListOf<HTMLInputElement>; 

let question:IQuiz;

const getSelectedValue = (radios: NodeListOf<HTMLInputElement>) => {
  for (const radio of radios) {
      if (radio.checked) {
          return radio.value;
      }
  }
  return "";
};

const renderRadioBox = (language: string) => {
  if (!labelEasy || !labelHard) return;

  if (language === "de") {
    labelEasy.textContent = "Leicht";
    labelHard.textContent = "Schwer";
    difficultyRadios[0].value = "leicht";
    difficultyRadios[1].value = "schwer";
  } else {
    labelEasy.textContent = "Easy";
    labelHard.textContent = "Hard";
    difficultyRadios[0].value = "easy";
    difficultyRadios[1].value = "hard";
  }
};

const handleChange = () => {
  const selectedLanguage = getSelectedValue(languageRadios);
  const selectedLanguageValue = selectedLanguage;
  const selectedDifficulty = getSelectedValue(difficultyRadios);
  renderRadioBox(selectedLanguageValue);
  fetchAllData(selectedDifficulty)
};

difficultyRadios.forEach((radio) => radio.addEventListener("change", handleChange));
languageRadios.forEach((radio) => radio.addEventListener("change", handleChange));

const fetchAllData = async (url: string) => {
    const newUrl = `${BASE_URL + url + ".json"}`;
    const response: Response = await fetch(newUrl);
    const data: IQuiz = await response.json();
    console.log(data)
    renderQuestions(data)
};



const renderQuestions = (questions: IQuiz) => {
  console.log(question)
    questionContainer.innerHTML = `
        <h2 id="question-title">${questions.question}</h2>
        <form id="answer-form">
            ${questions.answers
                .map(
                    (answer, index) => `
                <label>
                    <input type="radio" name="answer" value="${index}">
                    ${answer}
                </label>
            `
                )
                .join("")}
        </form>
        <button id="submit-btn" class="btn">Antwort überprüfen</button>
        <p id="feedback" class="result"></p>
    `;

    const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
    const feedback = document.getElementById("feedback") as HTMLParagraphElement;

    submitBtn.addEventListener("click", () => {
        const selectedAnswer = getSelectedValue(answerCollection);

        if (Number(selectedAnswer) === questions.correct) {
            feedback.textContent = "✅";
        } else {
            feedback.textContent = "❌";
        }
    });
};
