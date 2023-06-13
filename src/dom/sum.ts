import sum from "../sum";

export default function () {
    const sumElement = document.createElement('h2');
    const a = 40;
    const b = 3;

    sumElement.innerText = `${a} + ${b} = ${sum(a, b)}`;

    return sumElement;
}