function component() {
    const element = document.createElement('div');

    element.innerHTML = ['Hello', 'webpack'].join(' ');
    
    console.log(1234, "123");

    return element;
}

document.body.appendChild(component());