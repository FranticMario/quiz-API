import { IQuiz } from "./interfaces/IQuiz";

const difficultyRadios = document.getElementsByName("difficulty") as NodeListOf<HTMLInputElement>;
const languageRadios = document.getElementsByName("language") as NodeListOf<HTMLInputElement>;
const BASE_URL = "https://vz-wd-24-01.github.io/typescript-quiz/questions/";

let question: IQuiz;

const questionContainer = document.getElementById("question-box") as HTMLDivElement;
const answerCollection = document.getElementsByName("answer") as NodeListOf<HTMLInputElement>;

const getSelectedValue = (radios: NodeListOf<HTMLInputElement>): string => {
    for (const radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return "";
};

const handleChange = () => {
    const selectedDifficulty = getSelectedValue(difficultyRadios);
    const selectedLanguage = getSelectedValue(languageRadios);
};

difficultyRadios.forEach((radio) => radio.addEventListener("change", handleChange));
languageRadios.forEach((radio) => radio.addEventListener("change", handleChange));

const fetchAllData = async (url: string) => {
    const newUrl = `${BASE_URL + url + ".json"}`;
    const response: Response = await fetch(newUrl);
    const data: IQuiz = await response.json();
    console.log(data);
};

fetchAllData("easy");

const renderQuestions = (questions: IQuiz) => {
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
        const selecterAnswerValue = selectedAnswer.value;

        if (Number(selecterAnswerValue) === questions.correct) {
            feedback.textContent = "✅";
        } else {
            feedback.textContent = "❌";
        }
    });
};
