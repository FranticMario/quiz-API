import { IQuiz } from "./interfaces/IQuiz";



const languageRadios = document.getElementsByName("language") as NodeListOf<HTMLInputElement>;
const difficultyRadios = document.getElementsByName("difficulty") as NodeListOf<HTMLInputElement>;
const BASE_URL = "https://vz-wd-24-01.github.io/typescript-quiz/questions/";
const labelEasy = document.getElementById("label-easy") as HTMLInputElement;
const labelHard = document.getElementById("label-hard") as HTMLInputElement;
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

const fetchAllData = async (url:string) => {
  const newUrl = `${BASE_URL + url + ".json"}`;
  const response:Response = await fetch(newUrl);
  const data:IQuiz = await response.json();
  console.log(data);
}

fetchAllData("easy")