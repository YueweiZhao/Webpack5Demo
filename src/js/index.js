import '../style/main.css';
import '../style/style.scss';
import pic from '../static/annoy.gif';

const consoleHello = () => {
  console.log('Hello World');
}

const clickFunc = () => {
  document.getElementById('eventTarget').click();
  document.getElementById('eventTarget').dispatchEvent(new Event("click"));
  document.getElementById('eventTarget').dispatchEvent(new MouseEvent("click"));
}

const addImg = () => {
  const img = new Image();
  img.src = pic;
  document.querySelector('body').append(img);
}

const newPro = () => {
  return new Promise(resolve => {
    resolve('hello_world')
  }).then(res => {
    console.log(res);
  })
}

newPro().then(r => {
  console.log(r);
});