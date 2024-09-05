const wrapper = document.querySelector(".wrapper");
const count_box = wrapper.querySelector(".volume_count .count_box");
const question = wrapper.querySelector(".question p");
const timerBox = wrapper.querySelector(".timer .timer_box");
const options = wrapper.querySelectorAll(".option_box .option");
const optionsPara = wrapper.querySelectorAll(".option_box .option p");
const nextButtom = wrapper.querySelector(".next_buttom");
const startQuizButton = document.querySelector(".startQuiz");
const result_box = document.querySelector(".result_box");
const retryButton = document.querySelector(".retry");
import { mcqQuestions, motivationalLines } from "./constant/index.js";

let count = parseInt(localStorage.getItem("count")) || 0;
localStorage.setItem("question", JSON.stringify(mcqQuestions));
localStorage.setItem("count", count);

localStorage.setItem("correct", 0);

let isOptionClick = false;

const timer = (hide) => {
    let countTimer = 30;


    const id = setInterval(() => {
        if (hide) {
            clearInterval(id);
        }
        timerBox.innerText = `00/${countTimer}`;

        if (countTimer < 20) {
            document.body.style.backgroundColor = "#FFA62F"
        }

        if (countTimer < 10) {
            document.body.style.backgroundColor = "#FF7D29"
        }

        if (countTimer < 5) {
            document.body.style.backgroundColor = "#973131"
        }

        countTimer -= 1;
        if (countTimer < 0) {
            clearInterval(id);
        }
    }, 1000)

}

const checkAnswer = (answer, id) => {
    let isClick = false;
    // timer(false);
    options.forEach((option, index) => {
        option.addEventListener("click", function handleClick() {

            if (isClick) {
                option.removeEventListener("click", handleClick);
            } else {
                // timer(true);
                isOptionClick = true;

                isClick = true;

                const optionText = option.querySelector("p").innerText;

                if (optionText === answer) {
                    const correct = parseInt(localStorage.getItem("correct"));
                    localStorage.setItem("correct", correct + 1)
                    option.classList.add("green_border");
                    var audio = new Audio('/sound/correct.mp3');
                    audio.play();

                    const right = option.querySelector(".option_result")
                    right.innerHTML = `<img src="/images/check-button.png" alt="right" />`;

                } else {

                    options[id].classList.add("green_border");

                    const right = options[id].querySelector(".option_result");
                    right.innerHTML = `<img src="/images/check-button.png" alt="right" />`;

                    option.classList.add("red_border");
                    const wrong = option.querySelector(".option_result")
                    wrong.innerHTML = `<span>You choose</span>
                    <img src="/images/delete.png" alt=wrong" />`;

                    var audio = new Audio('/sound/wrong.mp3');
                    audio.play();

                }

                option.removeEventListener("click", handleClick);
            }

        })
    })

}


const displayQuestion = () => {
    const storedQuestions = JSON.parse(localStorage.getItem('question')) || {};

    const storedQuestion = storedQuestions[parseInt(localStorage.getItem("count"))];

    count_box.innerText = `${parseInt(localStorage.getItem("count")) + 1}/${mcqQuestions.length}`

    question.innerText = storedQuestion.question;

    optionsPara.forEach((option, index) => {
        option.innerText = storedQuestion.options[index]
    })

    const index = storedQuestion.options.indexOf(storedQuestion.answer);
    checkAnswer(storedQuestion.answer, index);

}

const startQuiz = () => {
    wrapper.style.display = "none";
    result_box.style.display = "none";
}

const showResult = () => {
    const correctNumber = parseInt(localStorage.getItem("correct"));
    const correctPercent = (correctNumber / mcqQuestions.length) * 100;
    document.querySelector('.static_box .correct').style.width = `${correctPercent}%`;
    document.querySelector('.static_box .wrong').style.width = `${100 - correctPercent}%`;

    document.querySelector(".correctPercent").innerText = `${correctPercent}%`;
    document.querySelector(".wrongPercent").innerText = `${100 - correctPercent}%`;

    document.querySelector(".quatation").innerText = motivationalLines[`${correctPercent}`];

    document.querySelector(".result_box .score").innerText = `${correctNumber}/${mcqQuestions.length}`;
}

startQuizButton.addEventListener('click', () => {
    wrapper.style.display = "block";
    displayQuestion();
    startQuizButton.style.display = "none";
})

nextButtom.addEventListener("click", () => {
    if (isOptionClick === true) {
        isOptionClick = false;
        if (count === mcqQuestions.length - 1) {
            localStorage.setItem("count", 0);
            wrapper.style.display = "none";
            showResult();
            result_box.style.display = "block";
        } else {
            count += 1;
            localStorage.setItem("count", count);
            optionsPara.forEach((option) => {
                option.innerText = "";
            })

            options.forEach((option) => {
                option.classList.remove("red_border");
                option.classList.remove("green_border");
                const option_result = option.querySelector(".option_result")
                if (option_result) {
                    option_result.innerHTML = "";
                }
            })
            displayQuestion();
        }
    } else {
        alert("Select option!");

    }
})

retryButton.addEventListener("click", () => {
    localStorage.setItem("count", 0);
    location.reload();
})

window.addEventListener('load', startQuiz);

