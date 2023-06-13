import { HeadingClass } from ".";

export default function () {
    const helloWorldElement = document.createElement('h1');
    helloWorldElement.innerText = 'Hello world!';

    helloWorldElement.attributes.setNamedItem(HeadingClass());

    return helloWorldElement;
}