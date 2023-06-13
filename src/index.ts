import { HelloWorld, Sum } from "./dom";

const body = document.getElementsByTagName('body').item(0);

if (body) {
    body.append(HelloWorld(), Sum())
}