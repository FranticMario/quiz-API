import { IQuiz } from "./interfaces/IQuiz";

const difficultyRadios = document.getElementsByName("difficulty") as NodeListOf<HTMLInputElement>;
const languageRadios = document.getElementsByName("language") as NodeListOf<HTMLInputElement>;
const BASE_URL = "https://vz-wd-24-01.github.io/typescript-quiz/questions/";

let question:IQuiz;

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



const fetchAllData = async (url:string) => {
  const newUrl = `${BASE_URL + url + ".json"}`;
  const response:Response = await fetch(newUrl);
  const data:IQuiz = await response.json();
  console.log(data);
}

fetchAllData("easy")