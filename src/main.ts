import { IQuiz } from "./interfaces/IQuiz";

const languageRadios = document.getElementsByName("language") as NodeListOf<HTMLInputElement>;
const difficultyRadios = document.getElementsByName("difficulty") as NodeListOf<HTMLInputElement>;
const BASE_URL = "https://vz-wd-24-01.github.io/typescript-quiz/questions/";
const labelEasy = document.getElementById("label-easy") as HTMLInputElement;
const labelHard = document.getElementById("label-hard") as HTMLInputElement;
const questionContainer = document.getElementById("question-box") as HTMLDivElement;
const answerCollection = document.getElementsByName("answer") as NodeListOf<HTMLInputElement>;

let questions: IQuiz[] = [];
let counterQuestions: number = 0;
let counterTrueAnswer: number = 0;

let maxQuestions: number = 0;

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
    renderRadioBox(selectedLanguage);

    const selectedDifficulty = getSelectedValue(difficultyRadios);
    fetchAllData(selectedDifficulty);
};
// const handleChange = () => {
//     const selectedLanguage = getSelectedValue(languageRadios);
//     const selectedLanguageValue = selectedLanguage;
//     const selectedDifficulty = getSelectedValue(difficultyRadios);
//     renderRadioBox(selectedLanguageValue);
//     console.log(selectedDifficulty)
//     fetchAllData(selectedDifficulty);
// };

difficultyRadios.forEach((radio) => radio.addEventListener("change", handleChange));
languageRadios.forEach((radio) => radio.addEventListener("change", handleChange));

const fetchAllData = async (url: string) => {
    const newUrl = `${BASE_URL + url + ".json"}`;
    const response: Response = await fetch(newUrl);
    const data: IQuiz[] = await response.json();
    questions = [...data];
    console.log(questions);
    maxQuestions = questions.length;
    renderQuestions();
};

const showResult = () => {
    const resultContainer = document.querySelector(".result-container") as HTMLElement;
    resultContainer.innerHTML = `
    <h2>Ergebnis</h2>
   <p id="total-result">${counterTrueAnswer}/${maxQuestions}</p>
   <button class="btn"><a href="/">Restart</a></button>
    `;
};

const renderQuestions = () => {
    const currentQuestion: IQuiz = questions[counterQuestions];
    questionContainer.innerHTML = `
        <h2 class="question-title" id="question-title">Frage ${counterQuestions + 1}: ${
        currentQuestion.question
    }</h2>
        <form class="options" id="answer-form">
            ${currentQuestion.answers
                .map(
                    (answer: string, index: number) => `
                <label class="option">
                    <input type="radio" name="answer" value="${index}" required>
                    ${answer}
                </label>
            `
                )
                .join("")}
        </form>
        <button id="submit-btn" class="btn">Antwort überprüfen</button>
        <p id="feedback" class="result"></p>
    `;

    const optionCollection = document.querySelectorAll(".option") as NodeListOf<HTMLLabelElement>;

    optionCollection.forEach((option) => {
        option.addEventListener("click", (e) => {

            optionCollection.forEach((option) => {
                if (option.classList.contains("tag-selected")) {
                    option.classList.remove("tag-selected");
                }
            });
            const eventTarger: any = e.currentTarget;
            eventTarger.classList.add("tag-selected");
        });
    });

    const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
    const feedback = document.getElementById("feedback") as HTMLParagraphElement;

    submitBtn.addEventListener("click", () => {
        const selectedRadioAnswer = Array.from(answerCollection).find((radio) => radio.checked);
        if (!selectedRadioAnswer) {
            feedback.textContent = "⛔";
            return;
        }

        answerCollection.forEach((item) => (item.disabled = true));
        submitBtn.disabled = true;
        const selectedAnswer = getSelectedValue(answerCollection);

        if (Number(selectedAnswer) === currentQuestion.correct) {
            feedback.textContent = "✅";
            counterTrueAnswer++;
        } else {
            feedback.textContent = "❌";
        }

        counterQuestions++;

        setTimeout(() => {
            if (counterQuestions === maxQuestions) {
                questionContainer.style.display = "none";
                showResult();

                return;
            }
            renderQuestions();
        }, 3000);
    });
};

const languageOptions = document.querySelectorAll(
    'input[name="language"]'
) as NodeListOf<HTMLInputElement>;

const difficultyOptions = document.querySelectorAll(
    'input[name="difficulty"]'
) as NodeListOf<HTMLInputElement>;

const handleOptionSelection = (options: NodeListOf<HTMLInputElement>, selectedClass: string) => {
    options.forEach((option) => {
        const label = option.parentElement;
        if (!label) return;

        label.addEventListener("click", () => {
            options.forEach((opt) => {
                const lbl = opt.parentElement;
                lbl?.classList.remove(selectedClass);
            });
            label.classList.add(selectedClass);
        });
    });
};

const setInitialSelection = () => {
    const selectedLanguage = getSelectedValue(languageRadios);
    const selectedDifficulty = getSelectedValue(difficultyRadios);

    languageRadios.forEach((radio) => {
        const label = radio.parentElement;
        if (!label) return;
        if (radio.value === selectedLanguage) {
            label.classList.add("tag-selected");
        } else {
            label.classList.remove("tag-selected");
        }
    });

    difficultyRadios.forEach((radio) => {
        const label = radio.parentElement;
        if (!label) return;
        if (radio.value === selectedDifficulty) {
            label.classList.add("tag-selected");
        } else {
            label.classList.remove("tag-selected");
        }
    });
};

handleOptionSelection(languageOptions, "tag-selected");
handleOptionSelection(difficultyOptions, "tag-selected");

document.addEventListener("DOMContentLoaded", () => {
    
    setInitialSelection();

 
    renderRadioBox(getSelectedValue(languageRadios));

 
    fetchAllData(getSelectedValue(difficultyRadios));
});